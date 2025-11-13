import "./LikedSongs.css";
import { FaHeart } from "react-icons/fa";

export default function LikedSongs({ songs, onSelect }) {
  return (
    <div className="liked-songs">
      <h2 className="liked-songs-title">Liked Songs</h2>
      {songs.map((song, index) => (
        <div
          key={index}
          className="liked-song-item"
          onClick={() => onSelect(song)}
        >
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
