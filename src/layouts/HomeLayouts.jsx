import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

const HomeLayouts = () => {
  return (
    <div>
      
      <header>
        <Navbar/>
      </header>
      <main>
        <Outlet/>
      </main>
      <footer>

      </footer>

    </div>
  );
};

export default HomeLayouts;