import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import '../styles/ProfileBanner.css';

const ProfileBanner = () => {
  const { viewingUserProfileInfo, userId } = useSelector(selectUser);
  const [file, setFile] = useState('');
  const { coverPhoto } = viewingUserProfileInfo;

  const coverPhotoStyles = {
    backgroundImage: coverPhoto ? `url(${coverPhoto})` : '',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="profile-banner">
      <div class="image-upload">
        <label for="file-input">
          <div
            className={`cover-photo-img ${
              !coverPhoto ? 'cover-photo-default' : ''
            }`}
            style={coverPhotoStyles}
          ></div>{' '}
        </label>

        <input id="file-input" type="file" hidden />
      </div>
    </div>
  );
};

export default ProfileBanner;
