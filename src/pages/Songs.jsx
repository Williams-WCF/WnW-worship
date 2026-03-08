import React, { useEffect, useState } from "react";
import LikedSongs from "../components/LikedSongs";
import "../components/LikedSongs.css";
import { supabase } from "../supabaseClient";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLikedSongs = async () => {
      setLoading(true);

      // Fetch all song_likes to compute total likes per song globally
      const { data: allLikes } = await supabase
        .from('song_likes')
        .select('song_title');

      if (allLikes) {
        const countMap = {};
        allLikes.forEach(({ song_title }) => {
          countMap[song_title] = (countMap[song_title] || 0) + 1;
        });

        const formatted = Object.entries(countMap)
          .map(([title, likes]) => ({ title, likes }))
          .sort((a, b) => b.likes - a.likes);

        setSongs(formatted);
      }

      setLoading(false);
    };

    fetchAllLikedSongs();
  }, []);

  return (
    <div className="songs-container">
      <LikedSongs songs={songs} loading={loading} />
    </div>
  );
}
