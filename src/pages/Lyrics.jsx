import { useEffect, useMemo, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useLyricsSync } from '../hooks/useLyricsSync';
import { supabase } from '../supabaseClient';

export default function Lyrics() {
  const { isAdmin, user } = useAuth();
  const {
    content,
    title,
    artist,
    currentLine,
    updateLyrics,
    updateTitle,
    updateArtist,
    updateCurrentLine
  } = useLyricsSync();
  const [isExpanded, setIsExpanded] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  return (
    <div className="lyrics-page">
      <div className="lyrics-console">
        <h2 className="lyrics-console-title">Lyrics Console</h2>

        <div className="lyrics-meta">
          {isAdmin ? (
            <div className="meta-inputs">
              <input
                className="meta-input"
                type="text"
                placeholder="Song title"
                value={title}
                onChange={(e) => updateTitle(e.target.value)}
              />
              <input
                className="meta-input"
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e) => updateArtist(e.target.value)}
              />
            </div>
          ) : (
            <div className="meta-display">
              <div className="meta-title">{title || 'Untitled'}</div>
              <div className="meta-artist">{artist || 'Unknown Artist'}</div>
            </div>
          )}
        </div>

        {user && (
          <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleLike}
              disabled={!title}
              style={{ background: 'none', border: 'none', cursor: title ? 'pointer' : 'default', fontSize: '1.4rem', color: liked ? '#e74c3c' : '#aaa', opacity: title ? 1 : 0.4 }}
              title={!title ? 'No song playing' : liked ? 'Unlike' : 'Like this song'}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span style={{ fontSize: '0.95rem', color: '#666' }}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </div>
        )}

        {isAdmin && (
          <div className="lyrics-editor-wrapper">
            <div className="lyrics-editor-actions">
              <button
                type="button"
                className="lyrics-action"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Contract' : 'Expand'}
              </button>
              <button
                type="button"
                className="lyrics-action danger"
                onClick={() => updateLyrics('')}
              >
                Clear
              </button>
            </div>
            <textarea
              className={`lyrics-editor ${isExpanded ? '' : 'collapsed'}`}
              placeholder="Paste or type lyrics here..."
              value={content}
              onChange={(e) => updateLyrics(e.target.value)}
            />
          </div>
        )}

        <div className="lyrics-display">
          {content ? (
            lines.map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={`lyrics-line ${currentLine === index ? 'active' : ''}`}
                onClick={isAdmin ? () => updateCurrentLine(index) : undefined}
                role={isAdmin ? 'button' : undefined}
                tabIndex={isAdmin ? 0 : -1}
                onKeyDown={
                  isAdmin
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          updateCurrentLine(index);
                        }
                      }
                    : undefined
                }
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