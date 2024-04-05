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
import useClickOutside from '../hooks/useClickOutside';
import backArrow from '../assets/backArrow.svg';
import FriendResults from '../components/FriendResults';
import '../styles/Navbar.css';

const Navbar = () => {
  const { profilePicture, isLoggedIn } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // UserOptions is a component that allows the user to logout or go to their profile,
  // and should only be rendered when the user clicks on their profile in the top right hence this state.
  const [renderUserOptions, setRenderUserOptions] = useState(false);
  const profileRef = useRef(null);
  // UserOptionsRef is part of the profileRef to ensure that the UserOptions stays open when the user clicks inside of the profileRef
  const userOptionsRef = useRef(null);
  const searchBarRef = useRef(null);
  const friendResultsRef = useRef(null);
  const searchIconRef = useRef(null);
  // Determines if the search bar should be expanded when the user clicks on the search bar input.
  // The expanded search bar represents a window with a larger search input where the user can search for other users on the site.
  const [expandSearchBar, setExpandSearchBar] = useState(false);

  useEffect(() => {
    dispatch(getLoggedInUserProfile());
  }, []);

  // When the user clicks outside of their profile icon, close the UserOptions
  useClickOutside({ parentRef: profileRef, childRef: userOptionsRef }, () =>
    setRenderUserOptions(false)
  );

  // When the user clicks away from the expanded search bar, close the expanded window.
  useClickOutside(
    { parentRef: searchBarRef, childRef: friendResultsRef },
    () => {
      setExpandSearchBar(false);
    }
  );

  // Set an active classname to the current icon the user is on, so the active icon can be filled blue.
  const setActiveClassName = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : 'inactive'}`;

  const navigateHome = () => {
    navigate('/');
  };

  const viewUserOptions = () => {
    setRenderUserOptions(true);
  };

  // When the user clicks on the input in the search bar, expand the search bar to the left.
  const handleClick = () => {
    searchBarRef.current.focus();
    setExpandSearchBar(true);
  };

  const closeExpandedSearchContainer = () => {
    setExpandSearchBar(false);
  };

  return (
    <>
      <nav
        className={`container-nav shadow-div ${
          expandSearchBar && 'container-nav-expanded'
        }`}
      >
        <div
          className={`left-container ${
            expandSearchBar && 'left-container-expanded'
          }`}
        >
          {!expandSearchBar ? (
            <img
              src={BuzzBridgeIcon}
              className="site-icon"
              onClick={navigateHome}
            />
          ) : (
            <img
              src={backArrow}
              className="back-arrow"
              onClick={closeExpandedSearchContainer}
            />
          )}
          <div
            className={`search-container ${
              expandSearchBar ? 'search-container-expanded' : ''
            }`}
            onClick={handleClick}
          >
            <img
              src={searchIcon}
              alt="Search Icon"
              className={expandSearchBar ? 'search-icon-expanded' : ''}
              ref={searchIconRef}
              id="search-icon"
            />
            <input
              type="text"
              placeholder="Search BuzzBridge"
              ref={searchBarRef}
              id="search-bar"
            />
            {expandSearchBar && (
              <div className="window" ref={friendResultsRef}>
                <div className="friend-results">
                  <FriendResults />
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`middle-container ${expandSearchBar && 'middle-expanded'}`}
        >
          <NavLink to="/" className={setActiveClassName} link="home">
            <AiFillHome size={30} className="nav-icon home-icon" />
            <div className="active-border"></div>
          </NavLink>
          <NavLink to="/friends" className={setActiveClassName} link="friends">
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
