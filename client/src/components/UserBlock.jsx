import React from 'react';
import '../styles/UserBlock.css';
import shortenName from '../utils/shortenName';
import FriendRequestOptions from './FriendRequestOptions';

const UserBlock = ({ firstName, lastName, photo, _id, isFriendRequest }) => {
  return (
    <div className="user-block-container">
      <div className="user-block-img">
        <img src={photo} />
      </div>
      <div className="block-user-name">
        <div>{shortenName(firstName, lastName)}</div>
        {isFriendRequest && <FriendRequestOptions />}
      </div>
    </div>
  );
};

export default UserBlock;
