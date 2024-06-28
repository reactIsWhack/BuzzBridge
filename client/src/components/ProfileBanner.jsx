import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  setUpdatedProfileType,
  updateUserProfile,
} from '../app/features/user/userSlice';
import '../styles/ProfileBanner.css';
import UserProfileInfo from './UserProfileInfo';
import loadingGif from '../assets/loading-gif.gif';
import { toast } from 'react-toastify';

const ProfileBanner = () => {
  const {
    viewingUserProfileInfo,
    userId,
    updateProfileLoading,
    updatedProfileType,
  } = useSelector(selectUser);
  const dispatch = useDispatch();

  const {
    coverPhoto,
    profileLoading,
    profilePicture,
    firstName,
    lastName,
    friends,
  } = viewingUserProfileInfo;

  let coverPhotoStyles = {
    backgroundImage: coverPhoto && !profileLoading ? `url(${coverPhoto})` : '',
    backgroundRepeat: 'no-repeat',
  };

  const handleChange = async (e) => {
    if (
      e.target.files[0].type === 'video/mp4' ||
      e.target.files[0].type === 'video/mov'
    ) {
      return toast.error('Video not permitted');
    }

    const formData = new FormData();
    formData.append('avatar', e.target.files[0]);
    formData.append('photoType', 'coverPhoto');
    await dispatch(setUpdatedProfileType('coverPhoto'));
    dispatch(updateUserProfile(formData));
  };

  return (
    <div className="profile-banner">
      <div className="profile-image-upload">
        <label htmlFor="file-input">
          {updateProfileLoading && updatedProfileType === 'coverPhoto' ? (
            <div className="cover-photo-default cover-photo-loader">
              <img src={loadingGif} />
            </div>
          ) : (
            <div
              className={`cover-photo-img ${
                !coverPhoto ? 'cover-photo-default' : ''
              }`}
              style={coverPhotoStyles}
            ></div>
          )}
        </label>

        {userId === viewingUserProfileInfo.userId && (
          <input id="file-input" type="file" onChange={handleChange} hidden />
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
