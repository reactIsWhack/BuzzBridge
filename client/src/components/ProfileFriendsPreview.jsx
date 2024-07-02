import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const ProfileFriendsPreview = () => {
  const { viewingUserProfileInfo } = useSelector(selectUser);
  const { profileLoading, friends, userId } = viewingUserProfileInfo;
  const navigate = useNavigate();

  const friendPreviewCard = friends.slice(0, 9).map((friend) => (
    <div className="friend-preview-card">
      <img
        src={friend.photo}
        onClick={() => navigate(`/userprofile/${friend._id}`)}
      />
      <Link to={`/userprofile/${friend._id}`}>
        {friend.firstName + ' ' + friend.lastName}
      </Link>
    </div>
  ));

  return (
    <div className="profile-friends-preview">
      <div className="profile-friend-labels">
        <div className="friend-captions">
          <Link to={`/userprofile/${userId}/friends`} className="friends-label">
            Friends
          </Link>
          <Link
            to={`/userprofile/${userId}/friends`}
            className="all-friends-caption"
          >
            See all friends
          </Link>
        </div>
      </div>
      {!profileLoading && (
        <div className="user-friends-total">
          {friends.length
            ? `${friends.length} ${friends.length === 1 ? 'friend' : 'friends'}`
            : 'No friends found'}
        </div>
      )}
      <div className="friend-preview-cards-container">{friendPreviewCard}</div>
    </div>
  );
};

export default ProfileFriendsPreview;
