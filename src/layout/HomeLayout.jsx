/*
This is the layout for the home page, ONLY on-launch.*/


import { Outlet } from "react-router-dom";
import MenuButton from "../components/MenuButton";
import "./HomeLayout.css";

export default function HomeLayout() {
  return (
    <div className="home-layout">
      <div className="home-menu">
        <MenuButton />
      </div>
      <Outlet />
    </div>
  );
}
