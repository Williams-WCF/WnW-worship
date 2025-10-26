import { Link } from 'react-router-dom';

//this is the main navigation bar
export default function MainNavigation(){
  return(
    <div className="nav-bar">
      <input className= "search-bar" placeholder="Search a song"/>
      <Link to="/" className="home">Home</Link>
      <Link to="/lyrics" className="lyrics">Lyrics</Link>
      <Link to="/suggest" className="suggest">Suggest</Link>
      <Link to="/songs" className="songs">Songs</Link>
      <Link to="/feedback" className="feedback">Feedback</Link>
      <Link to="/learn-more" className="learn-more">Learn More</Link>
    </div>
  );
}