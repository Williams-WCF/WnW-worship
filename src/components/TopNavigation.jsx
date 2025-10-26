import {Link} from 'react-router-dom';
//this is the top navigation bar
export default function TopNavigation(){
  return(
    <div className="top_navigation">
      <Link to="/login" className="login">Log In</Link>
      <Link to="/signup" className="signup">Sign Up</Link>
      <Link to="/logout" className="logout">Log Out</Link>
    </div>
  );
}