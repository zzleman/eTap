import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Routers from '../../routes/Routers';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const hideHeaderFooter = ['/register', '/login'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}

      <div className="flex-grow">
        <Routers />
      </div>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;
