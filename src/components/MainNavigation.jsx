/*this is the main navigation bar component which renders links to, home,lyrics,liked songs, and suggest using react router’s link element*/

import { Link } from 'react-router-dom';
import {FaHome, FaHeart, FaMusic, FaCommentDots } from "react-icons/fa";


export default function MainNavigation() {
  return (
    <div className="nav-bar">
      {/* <Link to="/main-home" className="nav-link">
        <span className="emoji"><FaHome size={18} style={{ marginRight: "8px" }} /></span> Home
      </Link> */}
      <Link to="/lyrics" className="nav-link">
        <span className="emoji"><FaMusic size={18} color="#9c95a0ff" title="Lyrics" /></span> Current Song
      </Link>
      <Link to="/songs" className="nav-link">
        <span className="emoji"><FaHeart size={18} color="#e63946" title="Like" /></span> Liked Songs
      </Link>
      <Link to="/suggest" className="nav-link">
        <span className="emoji"><FaCommentDots size={18} color="#ffd700" title="Suggest" /></span> Suggest
      </Link>
    </div>
  );
}