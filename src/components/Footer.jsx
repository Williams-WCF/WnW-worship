import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-title">Williams Christian Fellowship</h2>
        <div className="footer-main">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/lyrics">Lyrics</Link></li>
              <li><Link to="/suggest">Suggest</Link></li>
              <li><Link to="/songs">Songs</Link></li>
              <li><Link to="/learn-more">Learn More</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-column center">
            <h4>Information</h4>
            <ul>
              <li><Link to="/comment">Comment Form</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/non-discrimination">Non-Discrimination Statement</Link></li>
            </ul>
          </div>

          <div className="footer-column right">
            <h4>Contact</h4>
            <address>
              <p>Hopkins Hall</p>
              <p>880 Main Street</p>
              <p>Williamstown, MA 01267 USA</p>
              <p>(413) 597-3131</p>
            </address>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>Log In • Copyright {new Date().getFullYear()} Williams Christian Fellowship</p>
        </div>
      </div>
    </footer>
  );
}
