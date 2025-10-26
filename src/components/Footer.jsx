import {Link} from 'react-router-dom';
//this if the footer

export default function Footer(){
  return(
    <div>
      <small>&copy;</small><p>Williams Christian Fellowship</p>
      <Link to="/lyrics" className="lyrics">Lyrics</Link>
      <Link to="/suggest" className="suggest">Suggest</Link>
      <Link to="/songs" className="songs">Songs</Link>
      <Link to="/feedback" className="feedback">Feedback</Link>
      <Link to="/learn-more" className="learn-more">Learn More</Link>
    </div>
  );
}