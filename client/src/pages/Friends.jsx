import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import '../styles/Friends.css';
import FriendRequests from '../components/FriendRequests';
import { useDispatch } from 'react-redux';
import { getLoggedInUserProfile } from '../app/features/user/userSlice';

const Friends = () => {
  useRedirectLoggedOutUser('/friends');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoggedInUserProfile());
  }, []);

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
