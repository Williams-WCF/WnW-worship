import "./williams-branding/fonts.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import HomeLayout from "./layout/HomeLayout.jsx";

import Home from "./pages/Home";
import Lyrics from "./pages/Lyrics";
import Feedback from "./pages/Feedback";
import MainHome from "./pages/MainHome";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import Suggest from "./pages/Suggest";
import Songs from "./pages/Songs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home layout for onboarding & login */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
      </Route>


        {/* Main layout for full app */}
        <Route element={<Layout />}>
          <Route path="/lyrics" element={<Lyrics />} />
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/main-home" element={<MainHome />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
