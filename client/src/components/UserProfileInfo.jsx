import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCamera } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  setUpdatedProfileType,
  updateUserProfile,
} from '../app/features/user/userSlice';
import FriendLabels from './FriendLabels';

const UserProfileInfo = ({
  photo,
  firstName,
  lastName,
  friends,
  profileId,
  profileLoading,
}) => {
  const navigate = useNavigate();
  const { userId, updateProfileLoading, updatedProfileType } =
    useSelector(selectUser);
  const dispatch = useDispatch();

  const friendProfilePictures = friends
    .slice(0, 8)
    .map((friend) => (
      <img
        key={friend._id}
        src={friend.photo}
        style={{ zIndex: 8 - friends.indexOf(friend) }}
        onClick={() => navigate(`/userprofile/${friend._id}`)}
      />
    ));

  const handleChange = async (e) => {
    if (e.target.files[0].type === 'video/mp4') return;

    const formData = new FormData();
    formData.append('avatar', e.target.files[0]);
    formData.append('photoType', 'pfp');
    await dispatch(setUpdatedProfileType('pfp'));
    dispatch(updateUserProfile(formData));
  };

  return (
    <div className="user-profile-info">
      <div className="user-profile-photo">
        <label htmlFor="file-input-pfp">
          {updateProfileLoading && updatedProfileType === 'pfp' ? (
            <div className="loader-spinner pfp-loader-spinner"></div>
          ) : (
            <div>
              <img src={photo} />
              {userId === profileId && (
                <div className="camera-icon">
                  <CiCamera size={25} strokeWidth={1} />
                </div>
              )}
            </div>
          )}
        </label>
        {userId === profileId && (
          <input
            id="file-input-pfp"
            type="file"
            onChange={handleChange}
            hidden
          />
        )}
      </div>
      <div className="contact-info">
        <div className="profile-name">{firstName + ' ' + lastName}</div>
        <div className="friends-count">
          {!profileLoading ? `${friends.length} friends` : ''}
        </div>
        <div className="friends-profile-pictures">{friendProfilePictures}</div>
      </div>
      {userId !== profileId && !profileLoading && <FriendLabels />}
    </div>
  );
};

export default UserProfileInfo;
