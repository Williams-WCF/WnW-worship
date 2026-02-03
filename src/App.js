import "./williams-branding/fonts.css";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Layout from "./Layout";
import HomeLayout from "./layout/HomeLayout.jsx";

import Lyrics from "./pages/Lyrics";
import Feedback from "./pages/Feedback";
import MainHome from "./pages/MainHome";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import Suggest from "./pages/Suggest";
import Songs from "./pages/Songs";
import Admin from "./pages/Admin";

// Protected Layout wrapper
function ProtectedLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Layout /> : <Navigate to="/login" />;
}

// Public Layout wrapper (redirects if already logged in)
function PublicLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Navigate to="/lyrics" /> : <HomeLayout />;
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/lyrics" /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthGate />} />
        {/* Home layout for onboarding & login */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Main layout for full app */}
        <Route element={<ProtectedLayout />}>
          <Route path="/lyrics" element={<Lyrics />} />
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/main-home" element={<MainHome />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}