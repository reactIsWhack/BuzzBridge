import React from 'react';
import '../styles/UserCard.css';

const UserCard = ({ name, photo, _id }) => {
  return (
    <div className="user-card" id={_id}>
      <img src={photo} />
      <div>{name}</div>
    </div>
  );
};

export default UserCard;
