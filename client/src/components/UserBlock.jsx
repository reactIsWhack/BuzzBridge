import React from 'react';
import '../styles/UserBlock.css';

const UserBlock = ({ firstName, lastName, photo, _id }) => {
  return (
    <div className="user-block-container">
      <div className="user-block-img">
        <img src={photo} />
      </div>
      <div className="block-user-name">{firstName + ' ' + lastName}</div>
    </div>
  );
};

export default UserBlock;
