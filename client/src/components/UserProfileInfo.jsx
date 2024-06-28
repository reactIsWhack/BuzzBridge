import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCamera } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
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
  const { userId } = useSelector(selectUser);

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

  return (
    <div className="user-profile-info">
      <div className="user-profile-photo">
        <label htmlFor="file-input">
          <img src={photo} />
          {userId === profileId && (
            <div className="camera-icon">
              <CiCamera size={25} strokeWidth={1} />
            </div>
          )}
        </label>
        {userId === profileId && <input id="file-input" type="file" hidden />}
      </div>
      <div className="contact-info">
        <div className="profile-name">{firstName + ' ' + lastName}</div>
        <div className="friends-count">
          {friends.length ? `${friends.length} friends` : ''}
        </div>
        <div className="friends-profile-pictures">{friendProfilePictures}</div>
      </div>
      {userId !== profileId && !profileLoading && <FriendLabels />}
    </div>
  );
};

export default UserProfileInfo;
