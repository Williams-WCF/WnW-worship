import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaUsers } from "react-icons/fa";
import logo from "../components/images/logo.jpg";

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
              <li><Link to="/songs">Songs</Link></li>
              <li><Link to="/suggest">Suggest</Link></li>
            </ul>
          </div>

          <div className="footer-column center">
            <img src={logo} alt="WCF Logo" className="home-logo" />
          </div>

          <div className="footer-column right">
            <h4>Contact</h4>
            <div className="social-icons">
            <a href = "https://www.instagram.com/williamschristianfellowship"
             target="_blank" rel="noopener noreferrer" className="ig-icon">
            <FaInstagram size={30} />
            </a>
            <a href="https://groupme.com/join_group/3587023/GGqkmG7J" target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-icon">
            <FaWhatsapp size={28} />
            </a>
            <a href="https://groupme.com/join_group/3587023/GGqkmG7J"
            target="_blank"
            rel="noopener noreferrer"
            className="groupme-icon">
            <FaUsers size={28} />
            </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Williams Christian Fellowship</p>
        </div>
      </div>
    </footer>
  );
}
