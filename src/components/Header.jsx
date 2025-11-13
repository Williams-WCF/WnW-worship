//this is the header
/*This represents the top section, displaying the logo, the site title, and a hamburger menu button on the right. The logo links back to the main home page, while the menu button provides access to other pages on smaller screens. However, I have not written the code to eliminate the main navigation bar links for smaller screen sizes. You can do that if it becomes necessary*/

import { Link } from "react-router-dom";
import MenuButton from "./MenuButton";
import logo from "../components/images/logo.jpg";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/main-home" className="logo-link">
          <img src={logo} alt="WCF Logo" className="header-logo" />
        </Link>
        <h1 className="header-title">WCF Wednesday Night Worship</h1>
      </div>
      <MenuButton />
    </header>
  );
}
