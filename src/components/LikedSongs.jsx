import "./LikedSongs.css";
import { FaHeart } from "react-icons/fa";

export default function LikedSongs({ songs, loading, user }) {
  return (
    <div className="liked-songs">
      <h2 className="liked-songs-title">Liked Songs</h2>

      {!user && (
        <p style={{ color: '#888', marginTop: '1rem' }}>Sign in to see your liked songs.</p>
      )}

      {user && loading && (
        <p style={{ color: '#888', marginTop: '1rem' }}>Loading...</p>
      )}

      {user && !loading && songs.length === 0 && (
        <p style={{ color: '#888', marginTop: '1rem' }}>You haven't liked any songs yet. Like a song on the Lyrics page!</p>
      )}

      {user && !loading && songs.map((song, index) => (
        <div key={index} className="liked-song-item">
          <span className="song-title">{song.title}</span>
          <span className="song-likes">
            <FaHeart className="heart-icon" />
            {song.likes}
          </span>
        </div>
      ))}
    </div>
  );
}
