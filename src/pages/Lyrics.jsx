import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLyricsSync } from '../hooks/useLyricsSync';

export default function Lyrics() {
  const { isAdmin } = useAuth();
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