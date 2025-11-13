//this is the first home page (on-launch).

/*Notice that there are two files with name "Home" associated with them. This is because I thought it more efficient to have two differenet types of home page: One that shows on launch, and the other that dominates while using the web. The one dominating the web has far more information. The information that a user gets on launching the web should not be overwhelming (and this is consistent with the Figma design), hence the two approaches.*/

import "../layout/HomeLayout.css";
import logo from "../components/images/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <img src={logo} alt="WCF Logo" className="home-logo" />
        <h2 className="home-title">W & W Songs</h2>
        <p className="home-subtitle">Come let’s worship together</p>

        <div className="home-buttons">
          <button className="home-btn login" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="home-btn skip" onClick={() => navigate("/lyrics")}>
            Skip
          </button>
          <p className="signup-text"> Don’t have an account?{" "}
          <button className="home-btn signup" onClick={() => navigate("/signup")}>
          Sign Up
          </button>
          </p>

        </div>
      </div>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Williams Christian Fellowship</p>
      </footer>
    </div>
  );
}

