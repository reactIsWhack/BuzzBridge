import React from 'react';
import Navbar from '../components/Navbar';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import '../styles/Friends.css';

const Friends = () => {
  useRedirectLoggedOutUser('/friends');
  return (
    <div className="friends-page">
      <Navbar />
      <h1>Friends</h1>
    </div>
  );
};

export default Friends;
