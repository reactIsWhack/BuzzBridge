import React from 'react';
import '../styles/ProfileNavbar.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const ProfileNavbar = () => {
  const { viewingUserProfileInfo } = useSelector(selectUser);

  const setActiveClassName = ({ isActive }) => {
    return `profile-link ${
      isActive ? 'profile-link-active' : 'profile-link-inactive'
    } `;
  };

  return (
    <nav className="profile-navbar">
      <ul className="profile-nav-links">
        <li>
          <NavLink
            end
            to={`/userprofile/${viewingUserProfileInfo.userId}`}
            className={setActiveClassName}
          >
            <span>Posts</span>
            <div className="profile-link-border"></div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/userprofile/${viewingUserProfileInfo.userId}/friends`}
            className={setActiveClassName}
          >
            <span>Friends</span>
            <div className="profile-link-border"></div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavbar;
