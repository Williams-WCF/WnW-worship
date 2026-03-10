import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaHeart } from 'react-icons/fa';
import './History.css';

// Returns the Sunday of the week containing `date`
function weekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(weekStartDate) {
  return 'Week of ' + weekStartDate.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function History() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [{ data: history, error: histErr }, { data: likes }] = await Promise.all([
        supabase
          .from('song_history')
          .select('id, title, artist, pushed_at')
          .order('pushed_at', { ascending: false }),
        supabase
          .from('song_likes')
          .select('song_title'),
      ]);
      if (histErr) console.error('[History] fetch failed:', histErr);

      // Build like-count map keyed by lowercased title
      const likeMap = {};
      (likes ?? []).forEach(({ song_title }) => {
        const key = song_title.toLowerCase();
        likeMap[key] = (likeMap[key] || 0) + 1;
      });

      // Group history rows by week
      const weekMap = {}; // ISO date string of week-start → { label, songs[] }
      (history ?? []).forEach((row) => {
        const ws = weekStart(row.pushed_at);
        const key = ws.toISOString();
        if (!weekMap[key]) {
          weekMap[key] = { label: formatWeekLabel(ws), songs: [], weekStartTs: ws.getTime() };
        }
        weekMap[key].songs.push({
          ...row,
          likes: likeMap[row.title.toLowerCase()] ?? 0,
        });
      });

      // Sort weeks newest-first
      const sorted = Object.values(weekMap).sort((a, b) => b.weekStartTs - a.weekStartTs);
      setWeeks(sorted);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="history-loading">Loading history…</div>;

  if (weeks.length === 0) {
    return (
      <div className="history-empty">
        <p>No songs have been pushed live yet.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h2 className="history-heading">Song History</h2>
      {weeks.map((week) => (
        <section key={week.weekStartTs} className="history-week">
          <h3 className="history-week-label">{week.label}</h3>
          <ul className="history-song-list">
            {week.songs.map((song) => (
              <li key={song.id} className="history-song-row">
                <div className="history-song-info">
                  <span className="history-song-title">{song.title}</span>
                  {song.artist && (
                    <span className="history-song-artist"> — {song.artist}</span>
                  )}
                  <span className="history-song-time">{formatTime(song.pushed_at)}</span>
                </div>
                {song.likes > 0 && (
                  <span className="history-likes">
                    <FaHeart size={13} color="#e63946" style={{ marginRight: 4 }} />
                    {song.likes}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
