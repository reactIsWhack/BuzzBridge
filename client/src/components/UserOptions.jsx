import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../app/features/user/userSlice';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserOptions = () => {
  const { name, profilePicture } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => dispatch(logoutUser(navigate));

  return (
    <div className="options-container">
      <div className="profile-card-box shadow-div">
        <img src={profilePicture} />
        <div>{name}</div>
      </div>
      <div className="logout-container" onClick={logout}>
        <div className="logout-icon">
          <FiLogOut size={20} />
        </div>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default UserOptions;
