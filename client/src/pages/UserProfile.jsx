import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();

  return (
    <div className="user-profile-page">
      <Navbar />
      <h1>UserProfile {userId}</h1>
    </div>
  );
};

export default UserProfile;
