import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserBlock from './UserBlock';

const FriendRequests = () => {
  const { friendRequests, isLoading } = useSelector(selectUser);

  const userCard = friendRequests.map((friendRequest) => {
    return (
      <UserBlock
        key={friendRequest._id}
        {...friendRequest}
        isFriendRequest={true}
      />
    );
  });

  return (
    <div className="friend-requests-section">
      <h2 className="friend-request-header">Friend Requests</h2>
      {isLoading ? (
        <div className="loader-spinner"></div>
      ) : (
        <div className="user-cards-container">
          {friendRequests.length ? (
            userCard
          ) : (
            <div className="no-requests-label">You have no friend requests</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
