import React, { useState, useRef, useEffect } from 'react';
import searchIcon from '../assets/searchIcon.svg';
import BuzzBridgeIcon from '../assets/BuzzBridgeIcon.jpg';
import { FaUserFriends } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLoggedInUserProfile,
  selectUser,
} from '../app/features/user/userSlice';
import UserOptions from './UserOptions';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';

const Navbar = () => {
  const { profilePicture, isLoggedIn } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [renderUserOptions, setRenderUserOptions] = useState(false);
  const profileRef = useRef(null);
  const userOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        userOptionsRef.current &&
        !userOptionsRef.current.contains(event.target)
      ) {
        setRenderUserOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const setActiveClassName = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : 'inactive'}`;

  const navigateHome = () => {
    navigate('/');
  };

  const viewUserOptions = () => {
    setRenderUserOptions(true);
  };

  return (
    <>
      <nav className="container-nav shadow-div">
        <div className="left-container">
          <img
            src={BuzzBridgeIcon}
            className="site-icon"
            onClick={navigateHome}
          />
          <div className="search-container">
            <img src={searchIcon} alt="Search Icon" />
            <input type="text" placeholder="Search BuzzBridge" />
          </div>
        </div>
        <div className="middle-container">
          <NavLink to="/" className={setActiveClassName}>
            <AiFillHome size={30} className="nav-icon home-icon" />
            <div className="active-border"></div>
          </NavLink>
          <NavLink to="/friends" className={setActiveClassName}>
            <FaUserFriends size={30} className="nav-icon" />
            <div className="active-border"></div>
          </NavLink>
        </div>
        <div className="right-container">
          <img
            src={profilePicture}
            className="profile-picture"
            onClick={viewUserOptions}
            ref={profileRef}
            alt="Profile"
          />
          {renderUserOptions && (
            <div className="user-options-container" ref={userOptionsRef}>
              <UserOptions />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
