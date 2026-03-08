import "./LikedSongs.css";
import { FaHeart } from "react-icons/fa";

export default function LikedSongs({ songs, loading }) {
  return (
    <div className="liked-songs">
      <h2 className="liked-songs-title">Liked Songs</h2>

      {loading && (
        <p className="liked-songs-empty">Loading...</p>
      )}

      {!loading && songs.length === 0 && (
        <p className="liked-songs-empty">No songs have been liked yet. Like a song on the Lyrics page!</p>
      )}

      {!loading && (
        <ol className="liked-songs-list">
          {songs.map((song, index) => (
            <li key={index} className="liked-song-row">
              <span className="song-title">{song.title}</span>
              <span className="song-likes">
                <FaHeart className="heart-icon" />
                {song.likes}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
