import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./Layout";
import Home from "./pages/Home";
import Lyrics from "./pages/Lyrics";
import Feedback from "./pages/Feedback";
import LearnMore from "./pages/Learnmore";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import Suggest from "./pages/Suggest";
import Songs from "./pages/Songs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="lyrics" element={<Lyrics/>}/>
        <Route path="suggest" element={<Suggest />} />
        <Route path="songs" element={<Songs/>} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="learn-more" element={<LearnMore />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
        <Route path="logout" element={<Logout/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
