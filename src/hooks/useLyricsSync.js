import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

// Queue is admin-local only — persisted in localStorage
const QUEUE_KEYS = {
  queue: 'lyrics_queue',
  queueIndex: 'lyrics_queueIndex',
};

const loadFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Write the live session row to Supabase (single row, id = 1)
const upsertSession = async (fields) => {
  const { error } = await supabase
    .from('live_session')
    .update(fields)
    .eq('id', 1);
  if (error) console.error('[useLyricsSync] upsert failed:', error);
};

export const useLyricsSync = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [currentLine, setCurrentLine] = useState(null);
  const [queue, setQueue] = useState(() => loadFromStorage(QUEUE_KEYS.queue, []));
  const [queueIndex, setQueueIndex] = useState(() => loadFromStorage(QUEUE_KEYS.queueIndex, -1));
  const channelRef = useRef(null);

  useEffect(() => {
    const isStale = (updatedAt) =>
      updatedAt && Date.now() - new Date(updatedAt).getTime() > INACTIVITY_MS;

    const clearIfStale = async () => {
      const { data } = await supabase
        .from('live_session')
        .select('updated_at, title')
        .eq('id', 1)
        .single();
      if (data?.title && isStale(data.updated_at)) {
        upsertSession({ content: '', title: '', artist: '', current_line: null });
        setContent(''); setTitle(''); setArtist(''); setCurrentLine(null);
      }
    };

    // 1. Fetch current state from DB on mount; auto-clear if stale
    supabase
      .from('live_session')
      .select('content, title, artist, current_line, updated_at')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          if (isStale(data.updated_at) && data.title) {
            upsertSession({ content: '', title: '', artist: '', current_line: null });
          } else {
            setContent(data.content ?? '');
            setTitle(data.title ?? '');
            setArtist(data.artist ?? '');
            setCurrentLine(data.current_line ?? null);
          }
        }
      });

    // 2. Subscribe to Postgres row-level changes so all clients update in real time
    const channel = supabase
      .channel('live-session-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'live_session', filter: 'id=eq.1' },
        ({ new: row }) => {
          setContent(row.content ?? '');
          setTitle(row.title ?? '');
          setArtist(row.artist ?? '');
          setCurrentLine(row.current_line ?? null);
        }
      )
      .subscribe();

    channelRef.current = channel;

    // 3. Poll every minute and clear if the session has been idle for 30+ min
    const inactivityTimer = setInterval(clearIfStale, 60 * 1000);

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      clearInterval(inactivityTimer);
    };
  }, []);

  const updateCurrentLine = (lineIndex) => {
    setCurrentLine(lineIndex);
    upsertSession({ current_line: lineIndex });
  };

  // ── Queue management (admin-local) ────────────────────────────────────────

  const clearLive = () => {
    upsertSession({ content: '', title: '', artist: '', current_line: null });
    // local state is updated via the realtime subscription, but set immediately for responsiveness
    setContent(''); setTitle(''); setArtist(''); setCurrentLine(null);
  };

  const addToQueue = (slot = { title: '', artist: '', content: '' }) => {
    const next = [...queue, slot];
    setQueue(next);
    saveToStorage(QUEUE_KEYS.queue, next);
  };

  const updateQueueSlot = (index, field, value) => {
    const next = queue.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setQueue(next);
    saveToStorage(QUEUE_KEYS.queue, next);
  };

  const removeFromQueue = (index) => {
    const wasLive = queueIndex === index;
    const next = queue.filter((_, i) => i !== index);
    setQueue(next);
    saveToStorage(QUEUE_KEYS.queue, next);
    let ni = queueIndex;
    if (wasLive) { ni = -1; clearLive(); }
    else if (queueIndex > index) ni = queueIndex - 1;
    setQueueIndex(ni);
    saveToStorage(QUEUE_KEYS.queueIndex, ni);
  };

  const goLive = (index) => {
    const slot = queue[index];
    if (!slot) return;
    setQueueIndex(index);
    saveToStorage(QUEUE_KEYS.queueIndex, index);
    // Write to DB — the realtime subscription propagates it to all clients
    upsertSession({ content: slot.content, title: slot.title, artist: slot.artist, current_line: null });
    // Update local state immediately for the admin who pressed Go Live
    setContent(slot.content);
    setTitle(slot.title);
    setArtist(slot.artist);
    setCurrentLine(null);
    // Record in history
    if (slot.title) {
      supabase
        .from('song_history')
        .insert({ title: slot.title, artist: slot.artist ?? '' })
        .then(({ error }) => {
          if (error) console.error('[useLyricsSync] song_history insert failed:', error);
        });
    }
  };

  const nextSong = () => { if (queueIndex < queue.length - 1) goLive(queueIndex + 1); };
  const prevSong = () => { if (queueIndex > 0) goLive(queueIndex - 1); };

  return {
    content, title, artist, currentLine,
    updateCurrentLine,
    queue, queueIndex,
    addToQueue, updateQueueSlot, removeFromQueue,
    goLive, clearLive, nextSong, prevSong,
  };
};
