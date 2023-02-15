import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header.component';
import Navbar from '../navbar/navbar.component';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Navbar />
    </>
  );
};

export default Layout;
