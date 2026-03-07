//this is the suggest form
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function Suggest() {
  const { isAdmin } = useAuth();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (!error) setSuggestions(data);
    };
    fetchSuggestions();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { error } = await supabase.from("suggestions").insert([
      {
        song_name: songName,
        artist_name: artistName,
        comments: comments,
        submitted_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error saving suggestion:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setSongName("");
      setArtistName("");
      setComments("");
    }
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

      {status === "success" && (
        <p style={{ color: "green", marginTop: "1rem" }}>🎵 Suggestion submitted! Thank you.</p>
      )}
      {status === "error" && (
        <p style={{ color: "red", marginTop: "1rem" }}>Something went wrong. Please try again.</p>
      )}

      {isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <h3>All Suggestions</h3>
          {suggestions.length === 0 ? (
            <p>No suggestions yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Song</th>
                  <th style={thStyle}>Artist</th>
                  <th style={thStyle}>Comments</th>
                  <th style={thStyle}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr key={s.id}>
                    <td style={tdStyle}>{s.song_name}</td>
                    <td style={tdStyle}>{s.artist_name || "—"}</td>
                    <td style={tdStyle}>{s.comments || "—"}</td>
                    <td style={tdStyle}>{new Date(s.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  borderBottom: "2px solid #ccc",
  padding: "0.5rem",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.5rem",
  verticalAlign: "top",
};
