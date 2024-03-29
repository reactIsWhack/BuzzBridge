import React from 'react';
import Navbar from '../components/Navbar';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';

const Friends = () => {
  useRedirectLoggedOutUser('/friends');
  return (
    <>
      <Navbar />
      <h1>Friends</h1>
    </>
  );
};

export default Friends;
