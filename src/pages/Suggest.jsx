//this is the suggest form
import React, { useState } from "react";

export default function Suggest() {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`🎵 Suggestion sent!\n\nSong: ${songName}\nArtist: ${artistName}\nComments: ${comments}`);
    setSongName("");
    setArtistName("");
    setComments("");
  };

  return (
    <div className="suggest-container">
      <h2 className="suggest-title">Song Suggestion</h2>
      <p className="suggest-subtitle">Hello! What songs would you like us to sing next time?</p>

      <form className="suggest-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="suggest-input"
          placeholder="Name of the song"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          required
        />

        <input
          type="text"
          className="suggest-input"
          placeholder="Name of the artist"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />

        <textarea
          className="suggest-textarea"
          placeholder="Any comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows="4"
        ></textarea>

        <button type="submit" className="suggest-btn">Submit Suggestion</button>
      </form>
    </div>
  );
}
