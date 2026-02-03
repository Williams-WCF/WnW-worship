import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

export const useLyricsSync = (channelName = 'lyrics-session') => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [currentLine, setCurrentLine] = useState(null);
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
        }
      })
      .on('broadcast', { event: 'title-update' }, (payload) => {
        if (payload?.payload?.title !== undefined) {
          setTitle(payload.payload.title);
        }
      })
      .on('broadcast', { event: 'artist-update' }, (payload) => {
        if (payload?.payload?.artist !== undefined) {
          setArtist(payload.payload.artist);
        }
      })
      .on('broadcast', { event: 'line-update' }, (payload) => {
        if (payload?.payload?.line !== undefined) {
          setCurrentLine(payload.payload.line);
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

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'line-update',
        payload: { line: lineIndex }
      });
    }
  };

  return {
    content,
    title,
    artist,
    currentLine,
    updateLyrics,
    updateTitle,
    updateArtist,
    updateCurrentLine
  };
};
