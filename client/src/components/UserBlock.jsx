import React from 'react';
import '../styles/UserBlock.css';
import shortenName from '../utils/shortenName';
import FriendRequestOptions from './FriendRequestOptions';
import { useNavigate } from 'react-router-dom';

const UserBlock = ({ firstName, lastName, photo, _id, isFriendRequest }) => {
  const navigate = useNavigate();
  const goToProfilePage = () => navigate(`/userprofile/${_id}`);

  return (
    <div className="user-block-container">
      <div className="user-block-img" onClick={goToProfilePage}>
        <img src={photo} />
      </div>
      <div className="block-user-name">
        <div onClick={goToProfilePage}>{shortenName(firstName, lastName)}</div>
        {isFriendRequest && <FriendRequestOptions _id={_id} />}
      </div>
    </div>
  );
};

export default UserBlock;
