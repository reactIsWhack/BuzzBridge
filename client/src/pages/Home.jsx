import React, { useEffect } from 'react';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import Navbar from '../components/Navbar';
import UnknownContacts from '../components/UnknownContacts';
import '../styles/Home.css';

const Home = () => {
  useRedirectLoggedOutUser('/');

  return (
    <>
      <Navbar />
      <div className="home">
        <div className="home-left">
          <UnknownContacts />
        </div>
        <div className="home-middle"></div>
        <div className="home-right"></div>
      </div>
    </>
  );
};

export default Home;
