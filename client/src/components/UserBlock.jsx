import React from 'react';
import '../styles/UserBlock.css';
import shortenName from '../utils/shortenName';

const UserBlock = ({ firstName, lastName, photo, _id }) => {
  return (
    <div className="user-block-container">
      <div className="user-block-img">
        <img src={photo} />
      </div>
      <div className="block-user-name">
        <div>{shortenName(firstName, lastName)}</div>
      </div>
    </div>
  );
};

export default UserBlock;
