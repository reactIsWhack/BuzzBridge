import React from 'react';
import '../styles/UserCard.css';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ firstName, lastName, photo, _id }) => {
  const navigate = useNavigate();
  const goToProfilePage = () => navigate(`/userprofile/${_id}`);

  return (
    <div className="user-card" id={_id} onClick={goToProfilePage}>
      <img src={photo} />
      <div>{firstName + ' ' + lastName}</div>
    </div>
  );
};

export default UserCard;
