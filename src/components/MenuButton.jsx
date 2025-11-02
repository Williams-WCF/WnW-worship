import React, {useState} from "react";
import "./MenuButton.css";
import { Link } from 'react-router-dom';

export default function MenuButton(){
  const [open, setOpen] = useState(false);
  const handleLinkClick = () => setOpen(false);
  return (
    <div className="menu-container" >
      <button className="menu-icon" onClick={()=>setOpen(!open)}>
        <div className={open ? "bar bar1 active" : "bar bar1"}></div>
        <div className={open ? "bar bar2 active" : "bar bar2"}></div>
        <div className={open ? "bar bar3 active" : "bar bar3"}></div>

      </button>
      {open && (
        <div className="menu-dropdown">
          <Link to="/login" className="login" onClick={handleLinkClick}>Log In</Link>
          <Link to="/signup" className="signup" onClick={handleLinkClick}>Sign Up</Link>
          <Link to="/logout" className="logout" onClick={handleLinkClick}>Log Out</Link>
          <Link to="/" className="home" onClick={handleLinkClick}>Home</Link>
          <Link to="/lyrics" className="lyrics" onClick={handleLinkClick}>Lyrics</Link>
          <Link to="/suggest" className="suggest" onClick={handleLinkClick}>Suggest</Link>
          <Link to="/songs" className="songs" onClick={handleLinkClick}>Songs</Link>
          <Link to="/feedback" className="feedback" onClick={handleLinkClick}>Feedback</Link>
          <Link to="/learn-more" className="learn-more" onClick={handleLinkClick}>Learn More</Link>
        </div>
      )

      }
    </div>
  );
}