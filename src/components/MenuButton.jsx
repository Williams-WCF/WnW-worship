/*this is the definition of the hamburger menu for navigation*/

import React, {useState} from "react";
import "./MenuButton.css";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function MenuButton(){
  const [open, setOpen] = useState(false);
  const handleLinkClick = () => setOpen(false);
  const {isAdmin } = useAuth();

  return (
    <div className="menu-container" >
      <button className="menu-icon" onClick={()=>setOpen(!open)}>
        <div className={open ? "bar bar1 active" : "bar bar1"}></div>
        <div className={open ? "bar bar2 active" : "bar bar2"}></div>
        <div className={open ? "bar bar3 active" : "bar bar3"}></div>
      </button>
      {open && (
        <div className="menu-dropdown">
          <Link to="/main-home" className="main-home" onClick={handleLinkClick}>Home</Link>
          <Link to="/lyrics" className="lyrics" onClick={handleLinkClick}>Lyrics</Link>
          <Link to="/songs" className="songs" onClick={handleLinkClick}>Liked Songs</Link>
          <Link to="/suggest" className="suggest" onClick={handleLinkClick}>Suggest</Link>
          <Link to="/logout" className="logout" onClick={handleLinkClick}>Logout</Link>
          {isAdmin && (
            <Link to="/admin" className="admin" onClick={handleLinkClick}>Admin</Link>
          )}
        </div>
      )

      }
    </div>
  );
}
