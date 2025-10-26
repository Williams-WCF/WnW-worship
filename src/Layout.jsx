import Header from './components/Header';
import TopNavigation from './components/TopNavigation';
import MainNavigation from './components/MainNavigation';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <Header />
      <TopNavigation />
      <MainNavigation />

      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
