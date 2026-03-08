import { useEffect, useMemo, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useLyricsSync } from '../hooks/useLyricsSync';
import { supabase } from '../supabaseClient';

export default function Lyrics() {
  const { isAdmin, user } = useAuth();
  const {
    content, title, artist, currentLine,
    updateCurrentLine,
    queue, queueIndex,
    addToQueue, updateQueueSlot, removeFromQueue, goLive, clearLive, nextSong, prevSong,
  } = useLyricsSync();

  // Start in Setup if there's nothing queued/live yet, else go straight to Live
  const [liveMode, setLiveMode] = useState(() => queue.length > 0 || !!content);
  const [expandedSlots, setExpandedSlots] = useState(new Set());
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleSlotExpand = (i) => setExpandedSlots((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  // Fetch like state whenever the song title changes
  useEffect(() => {
    if (!title) { setLikeCount(0); setLiked(false); return; }

    const fetchLikes = async () => {
      const { count } = await supabase
        .from('song_likes')
        .select('*', { count: 'exact', head: true })
        .eq('song_title', title);
      setLikeCount(count ?? 0);

      if (user) {
        const { data } = await supabase
          .from('song_likes')
          .select('id')
          .eq('song_title', title)
          .eq('user_id', user.id)
          .maybeSingle();
        setLiked(!!data);
      }
    };

    fetchLikes();
  }, [title, user]);

  const handleLike = async () => {
    if (!user || !title) return;

    if (liked) {
      await supabase
        .from('song_likes')
        .delete()
        .eq('song_title', title)
        .eq('user_id', user.id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase
        .from('song_likes')
        .insert([{ song_title: title, user_id: user.id }]);
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const lines = useMemo(() => content.split('\n'), [content]);

  // ── SETUP MODE (admin only) ────────────────────────────────────────────────
  if (isAdmin && !liveMode) {
    return (
      <div className="lyrics-page">
        <div className="lyrics-console">
          <div className="mode-header">
            <h2 className="lyrics-console-title" style={{ margin: 0 }}>Setup</h2>
            <button className="mode-toggle-btn" onClick={() => setLiveMode(true)}>
              Live View →
            </button>
          </div>

          <div className="queue-panel">
            <div className="queue-panel-header">
              <span className="queue-panel-title">Song Queue</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {queueIndex >= 0 && (
                  <button className="lyrics-action danger" onClick={clearLive}>Clear Live</button>
                )}
                <button className="lyrics-action" onClick={() => addToQueue()}>+ Add Song</button>
              </div>
            </div>

            {queue.length === 0 && (
              <p className="queue-empty">No songs queued yet. Add a song to get started.</p>
            )}

            {queue.map((slot, i) => (
              <div key={i} className={`queue-slot${queueIndex === i ? ' queue-slot-live' : ''}`}>
                <div className="queue-slot-header">
                  <div className="queue-slot-top">
                    <span className="queue-slot-num">{i + 1}</span>
                    <div className="queue-slot-meta">
                      <input
                        className="queue-slot-input"
                        placeholder="Song title"
                        value={slot.title}
                        onChange={(e) => updateQueueSlot(i, 'title', e.target.value)}
                      />
                      <input
                        className="queue-slot-input"
                        placeholder="Artist"
                        value={slot.artist}
                        onChange={(e) => updateQueueSlot(i, 'artist', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="queue-slot-actions">
                    <button className="lyrics-action" onClick={() => toggleSlotExpand(i)}>
                      {expandedSlots.has(i) ? 'Hide' : 'Lyrics'}
                    </button>
                    <button
                      className={`lyrics-action${queueIndex === i ? ' queue-live-btn' : ''}`}
                      onClick={() => { goLive(i); setLiveMode(true); }}
                    >
                      {queueIndex === i ? '● Live' : '▶ Go Live'}
                    </button>
                    <button className="lyrics-action danger" onClick={() => removeFromQueue(i)}>✕</button>
                  </div>
                </div>
                {expandedSlots.has(i) && (
                  <textarea
                    className="queue-slot-textarea"
                    placeholder="Paste lyrics here..."
                    value={slot.content}
                    onChange={(e) => updateQueueSlot(i, 'content', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LIVE MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="lyrics-page">
      <div className="lyrics-console">

        {/* Admin toolbar */}
        {isAdmin && (
          <div className="mode-header">
            <div className="mode-live-nav">
              {queue.length > 1 && (
                <>
                  <button
                    className="lyrics-action"
                    disabled={queueIndex <= 0}
                    onClick={prevSong}
                  >← Prev</button>
                  <span className="queue-nav-label">
                    {queueIndex >= 0 ? `${queueIndex + 1} / ${queue.length}` : `— / ${queue.length}`}
                  </span>
                  <button
                    className="lyrics-action"
                    disabled={queueIndex >= queue.length - 1}
                    onClick={nextSong}
                  >Next →</button>
                </>
              )}
            </div>
            <button className="mode-toggle-btn" onClick={() => setLiveMode(false)}>
              ✎ Setup
            </button>
          </div>
        )}

        {/* Song meta */}
        <div className="meta-display">
          <div className="meta-title">{title || (isAdmin ? 'No song selected' : 'Untitled')}</div>
          {(artist || !isAdmin) && (
            <div className="meta-artist">{artist || 'Unknown Artist'}</div>
          )}
        </div>

        {/* Like button */}
        {user && (
          <div className="like-row">
            <button
              onClick={handleLike}
              disabled={!title}
              className="like-btn"
              style={{ color: liked ? '#e74c3c' : 'rgba(255,255,255,0.4)', opacity: title ? 1 : 0.35 }}
              title={!title ? 'No song playing' : liked ? 'Unlike' : 'Like this song'}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span className="like-count">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </div>
        )}

        {/* Lyrics display */}
        <div className="lyrics-display">
          {content ? (
            lines.map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={`lyrics-line ${currentLine === index ? 'active' : ''}`}
                onClick={isAdmin ? () => updateCurrentLine(index) : undefined}
                role={isAdmin ? 'button' : undefined}
                tabIndex={isAdmin ? 0 : -1}
                onKeyDown={isAdmin ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateCurrentLine(index); }
                } : undefined}
              >
                {line || '\u00A0'}
              </div>
            ))
          ) : (
            <p className="no-lyrics">No lyrics to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}