//this is the header
import MenuButton from "./MenuButton";
import "./MenuButton.css";

export default function Header(){
  return(
    <div className='header'>
      <h1>WCF Lyrics App</h1>
      <MenuButton />
    </div>
  );
}