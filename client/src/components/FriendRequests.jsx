import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserBlock from './UserBlock';

const FriendRequests = () => {
  const { friendRequests } = useSelector(selectUser);

  const userCard = friendRequests.map((friendRequest) => {
    return <UserBlock key={friendRequest._id} {...friendRequest} />;
  });

  return (
    <div className="friend-requests-section">
      <h2 className="friend-request-header">Friend Requests</h2>
      <div className="request-cards-container">
        {friendRequests.length ? (
          userCard
        ) : (
          <div className="no-requests-label">You have no friend requests</div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
