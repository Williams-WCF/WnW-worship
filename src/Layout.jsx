/*
this is the global layout template for all the pages except the on-launch homepage*/

import Header from './components/Header';
import MainNavigation from './components/MainNavigation';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-nav">
      <MainNavigation />
      {/* <TopNavigation /> */}
      </div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
