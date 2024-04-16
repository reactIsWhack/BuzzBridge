import React from 'react';
import '../styles/UserCard.css';

const UserCard = ({ firstName, lastName, photo, _id }) => {
  return (
    <div className="user-card" id={_id}>
      <img src={photo} />
      <div>{firstName + ' ' + lastName}</div>
    </div>
  );
};

export default UserCard;
