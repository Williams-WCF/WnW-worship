import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const STORAGE_KEYS = {
  content: 'lyrics_content',
  title: 'lyrics_title',
  artist: 'lyrics_artist',
  currentLine: 'lyrics_currentLine',
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

export const useLyricsSync = (channelName = 'lyrics-session') => {
  const storedQueue = loadFromStorage(STORAGE_KEYS.queue, []);
  const storedIndex = loadFromStorage(STORAGE_KEYS.queueIndex, -1);
  const hasLive = storedIndex >= 0;

  // If nothing is marked live, wipe any stale live content from storage on init
  if (!hasLive) {
    saveToStorage(STORAGE_KEYS.content, '');
    saveToStorage(STORAGE_KEYS.title, '');
    saveToStorage(STORAGE_KEYS.artist, '');
    saveToStorage(STORAGE_KEYS.currentLine, null);
  }

  const [content, setContent] = useState(() => hasLive ? loadFromStorage(STORAGE_KEYS.content, '') : '');
  const [title, setTitle] = useState(() => hasLive ? loadFromStorage(STORAGE_KEYS.title, '') : '');
  const [artist, setArtist] = useState(() => hasLive ? loadFromStorage(STORAGE_KEYS.artist, '') : '');
  const [currentLine, setCurrentLine] = useState(() => hasLive ? loadFromStorage(STORAGE_KEYS.currentLine, null) : null);
  const [queue, setQueue] = useState(() => storedQueue);
  const [queueIndex, setQueueIndex] = useState(() => storedIndex);
  const channelRef = useRef(null);

  useEffect(() => {
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel
      .on('broadcast', { event: 'lyrics-update' }, (payload) => {
        if (payload?.payload?.content !== undefined) {
          setContent(payload.payload.content);
          saveToStorage(STORAGE_KEYS.content, payload.payload.content);
        }
      })
      .on('broadcast', { event: 'title-update' }, (payload) => {
        if (payload?.payload?.title !== undefined) {
          setTitle(payload.payload.title);
          saveToStorage(STORAGE_KEYS.title, payload.payload.title);
        }
      })
      .on('broadcast', { event: 'artist-update' }, (payload) => {
        if (payload?.payload?.artist !== undefined) {
          setArtist(payload.payload.artist);
          saveToStorage(STORAGE_KEYS.artist, payload.payload.artist);
        }
      })
      .on('broadcast', { event: 'line-update' }, (payload) => {
        if (payload?.payload?.line !== undefined) {
          setCurrentLine(payload.payload.line);
          saveToStorage(STORAGE_KEYS.currentLine, payload.payload.line);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [channelName]);

  const updateLyrics = (nextContent) => {
    setContent(nextContent);
    saveToStorage(STORAGE_KEYS.content, nextContent);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'lyrics-update',
        payload: { content: nextContent }
      });
    }
  };

  const updateTitle = (nextTitle) => {
    setTitle(nextTitle);
    saveToStorage(STORAGE_KEYS.title, nextTitle);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'title-update',
        payload: { title: nextTitle }
      });
    }
  };

  const updateArtist = (nextArtist) => {
    setArtist(nextArtist);
    saveToStorage(STORAGE_KEYS.artist, nextArtist);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'artist-update',
        payload: { artist: nextArtist }
      });
    }
  };

  const updateCurrentLine = (lineIndex) => {
    setCurrentLine(lineIndex);
    saveToStorage(STORAGE_KEYS.currentLine, lineIndex);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'line-update',
        payload: { line: lineIndex }
      });
    }
  };

  // ── Queue management (admin-local, no broadcast) ──────────────────────────

  const clearLive = () => {
    setContent(''); saveToStorage(STORAGE_KEYS.content, '');
    setTitle('');   saveToStorage(STORAGE_KEYS.title, '');
    setArtist('');  saveToStorage(STORAGE_KEYS.artist, '');
    setCurrentLine(null); saveToStorage(STORAGE_KEYS.currentLine, null);
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'lyrics-update', payload: { content: '' } });
      channelRef.current.send({ type: 'broadcast', event: 'title-update',  payload: { title:   '' } });
      channelRef.current.send({ type: 'broadcast', event: 'artist-update', payload: { artist:  '' } });
      channelRef.current.send({ type: 'broadcast', event: 'line-update',   payload: { line:  null } });
    }
  };

  const addToQueue = (slot = { title: '', artist: '', content: '' }) => {
    const next = [...queue, slot];
    setQueue(next);
    saveToStorage(STORAGE_KEYS.queue, next);
  };

  const updateQueueSlot = (index, field, value) => {
    const next = queue.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setQueue(next);
    saveToStorage(STORAGE_KEYS.queue, next);
  };

  const removeFromQueue = (index) => {
    const wasLive = queueIndex === index;
    const next = queue.filter((_, i) => i !== index);
    setQueue(next);
    saveToStorage(STORAGE_KEYS.queue, next);
    let ni = queueIndex;
    if (wasLive) { ni = -1; clearLive(); }
    else if (queueIndex > index) ni = queueIndex - 1;
    setQueueIndex(ni);
    saveToStorage(STORAGE_KEYS.queueIndex, ni);
  };

  const goLive = (index) => {
    const slot = queue[index];
    if (!slot) return;
    setQueueIndex(index);
    saveToStorage(STORAGE_KEYS.queueIndex, index);
    // Reuse existing broadcast functions
    setContent(slot.content);
    saveToStorage(STORAGE_KEYS.content, slot.content);
    setTitle(slot.title);
    saveToStorage(STORAGE_KEYS.title, slot.title);
    setArtist(slot.artist);
    saveToStorage(STORAGE_KEYS.artist, slot.artist);
    setCurrentLine(null);
    saveToStorage(STORAGE_KEYS.currentLine, null);
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'lyrics-update', payload: { content: slot.content } });
      channelRef.current.send({ type: 'broadcast', event: 'title-update',  payload: { title:   slot.title   } });
      channelRef.current.send({ type: 'broadcast', event: 'artist-update', payload: { artist:  slot.artist  } });
      channelRef.current.send({ type: 'broadcast', event: 'line-update',   payload: { line:    null         } });
    }
  };

  const nextSong = () => { if (queueIndex < queue.length - 1) goLive(queueIndex + 1); };
  const prevSong = () => { if (queueIndex > 0) goLive(queueIndex - 1); };

  return {
    content,
    title,
    artist,
    currentLine,
    updateLyrics,
    updateTitle,
    updateArtist,
    updateCurrentLine,
    // Queue
    queue,
    queueIndex,
    addToQueue,
    updateQueueSlot,
    removeFromQueue,
    goLive,
    clearLive,
    nextSong,
    prevSong,
  };
};
