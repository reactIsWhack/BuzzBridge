import React from 'react';
import '../styles/ProfileMainContent.css';
import ProfileFriendsPreview from '../components/ProfileFriendsPreview';

const ProfileMainContent = () => {
  return (
    <div className="profile-main-content">
      <ProfileFriendsPreview />
      <div className="profile-posts">Profile Posts</div>
    </div>
  );
};

export default ProfileMainContent;
