import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../app/features/user/userSlice';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/UserOptions.css';

const UserOptions = ({ setRenderUserOptions }) => {
  const { firstName, lastName, profilePicture, userId } =
    useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => dispatch(logoutUser(navigate));
  const navigateToProfile = () => {
    navigate(`/userprofile/${userId}`);
    setRenderUserOptions(false);
  };

  return (
    <div className="options-container">
      <div className="hover-container">
        <div
          className="profile-card-box shadow-div"
          onClick={navigateToProfile}
        >
          <img src={profilePicture} />
          <div>{firstName + ' ' + lastName}</div>
        </div>
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
