/*
This is the layout for the home page, ONLY on-launch.*/


import { Outlet, useLocation } from "react-router-dom";
import MenuButton from "../components/MenuButton";
import "./HomeLayout.css";

export default function HomeLayout() {
  const location = useLocation();
  const hideMenu = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="home-layout">
      {!hideMenu && (
        <div className="home-menu">
          <MenuButton />
        </div>
      )}
      <Outlet />
    </div>
  );
}
