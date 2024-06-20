import React from 'react';
import Navbar from '../components/Navbar';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import '../styles/Friends.css';
import FriendRequests from '../components/FriendRequests';

const Friends = () => {
  useRedirectLoggedOutUser('/friends');
  return (
    <div className="friends-page">
      <Navbar />
      <div className="friends-content">
        <FriendRequests />
      </div>
    </div>
  );
};

export default Friends;
