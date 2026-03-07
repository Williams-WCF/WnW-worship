import React, { useEffect, useState } from "react";
import LikedSongs from "../components/LikedSongs";
import "../components/LikedSongs.css";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function Songs() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchLikedSongs = async () => {
      setLoading(true);

      // Fetch all song_likes to compute total likes per song
      const { data: allLikes } = await supabase
        .from('song_likes')
        .select('song_title, user_id');

      // Fetch songs this user liked
      const { data: userLikes } = await supabase
        .from('song_likes')
        .select('song_title, liked_at')
        .eq('user_id', user.id)
        .order('liked_at', { ascending: false });

      if (userLikes && allLikes) {
        const countMap = {};
        allLikes.forEach(({ song_title }) => {
          countMap[song_title] = (countMap[song_title] || 0) + 1;
        });

        const formatted = userLikes.map((row) => ({
          title: row.song_title,
          likes: countMap[row.song_title] || 1,
        }));
        setSongs(formatted);
      }

      setLoading(false);
    };

    fetchLikedSongs();
  }, [user]);

  return (
    <div className="songs-container">
      <LikedSongs songs={songs} loading={loading} user={user} />
    </div>
  );
}
