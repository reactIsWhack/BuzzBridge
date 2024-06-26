import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import '../styles/ProfileBanner.css';

const ProfileBanner = () => {
  const { viewingUserProfileInfo, userId } = useSelector(selectUser);
  const [file, setFile] = useState('');
  const { coverPhoto, profileLoading, postsLoading } = viewingUserProfileInfo;

  const coverPhotoStyles = {
    backgroundImage:
      coverPhoto && !profileLoading && !postsLoading
        ? `url(${coverPhoto})`
        : '',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="profile-banner">
      <div className="image-upload">
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
      </div>
    </div>
  );
};

export default ProfileBanner;
