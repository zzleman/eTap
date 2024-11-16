import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Routers from '../../routes/Routers';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const hideHeaderFooter = ['/register', '/login'].includes(location.pathname);

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <div>
        <Routers />
      </div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;
