import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import '../styles/ProfileBanner.css';
import UserProfileInfo from './UserProfileInfo';

const ProfileBanner = () => {
  const { viewingUserProfileInfo, userId } = useSelector(selectUser);
  const [file, setFile] = useState('');
  const {
    coverPhoto,
    profileLoading,
    postsLoading,
    profilePicture,
    firstName,
    lastName,
    friends,
  } = viewingUserProfileInfo;

  const coverPhotoStyles = {
    backgroundImage: coverPhoto && !profileLoading ? `url(${coverPhoto})` : '',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="profile-banner">
      <div className="profile-image-upload">
        <label htmlFor="file-input">
          <div
            className={`cover-photo-img ${
              !coverPhoto ? 'cover-photo-default' : ''
            }`}
            style={coverPhotoStyles}
          ></div>{' '}
        </label>

        {userId === viewingUserProfileInfo.userId && (
          <input id="file-input" type="file" hidden />
        )}
        <UserProfileInfo
          photo={profilePicture}
          firstName={firstName}
          lastName={lastName}
          friends={friends}
          profileLoading={profileLoading}
          profileId={viewingUserProfileInfo.userId}
        />
      </div>
    </div>
  );
};

export default ProfileBanner;
