import React, { useState } from "react";
import LikedSongs from "../components/LikedSongs";
import "../components/LikedSongs.css";

export default function Songs() {
  const [songs] = useState([
    {
      title: "Casting Crowns – Nathaniel Bassey",
      likes: 30,
      lyrics: `Casting crowns
Lifting hands
Bowing hearts
Is all we’ve come to do
Adonai, You reign on high...`,
    },
    {
      title: "Oceans – Hillsong United",
      likes: 8,
      lyrics: `Spirit lead me where my trust is without borders...`,
    },
    {
      title: "Way Maker – Sinach",
      likes: 20,
      lyrics: `Way maker, miracle worker, promise keeper...`,
    },
    {
      title: "Reckless Love – Cory Asbury",
      likes: 17,
      lyrics: `Oh, the overwhelming, never-ending reckless love of God...`,
    },
    {
      title: "What a Beautiful Name – Hillsong Worship",
      likes: 25,
      lyrics: `What a beautiful Name it is, the Name of Jesus...`,
    },
  ]);

  const [selectedSong, setSelectedSong] = useState(null);

  const handleSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <div className="songs-container">
      <LikedSongs songs={songs} onSelect={handleSelect} />

      {selectedSong && (
        <div className="lyrics-box">
          <h3>{selectedSong.title}</h3>
          <pre className="lyrics-text">{selectedSong.lyrics}</pre>
        </div>
      )}
    </div>
  );
}
