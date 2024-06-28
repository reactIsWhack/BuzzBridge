import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/UserProfile.css';
import ProfileBanner from '../components/ProfileBanner';
import { useDispatch } from 'react-redux';
import {
  getLoggedInUserProfile,
  getUserPosts,
  getUserProfile,
} from '../app/features/user/userSlice';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';

const UserProfile = () => {
  const { userId } = useParams();
  useRedirectLoggedOutUser(`/userprofile/${userId}`);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoggedInUserProfile());
    dispatch(getUserPosts(userId));
    dispatch(getUserProfile(userId));
  }, [userId]);

  return (
    <div className="user-profile-page">
      <Navbar />
      <ProfileBanner />
    </div>
  );
};

export default UserProfile;
