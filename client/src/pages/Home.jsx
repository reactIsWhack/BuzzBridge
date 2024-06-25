import React, { useEffect } from 'react';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import Navbar from '../components/Navbar';
import UnknownContacts from '../components/UnknownContacts';
import '../styles/Home.css';
import PostFeed from '../components/PostFeed';
import FriendList from '../components/FriendList';
import { useSelector } from 'react-redux';
import { selectPopup } from '../app/features/popup/popupSlice';
import DeletePostPopup from '../components/DeletePostPopup';
import useDisableBackground from '../hooks/useDisableBackground';
import { useLocation } from 'react-router-dom';
import { selectUser } from '../app/features/user/userSlice';

const Home = () => {
  useRedirectLoggedOutUser('/');
  const { renderDeletePostPopup } = useSelector(selectPopup);
  const { isLoading } = useSelector(selectUser);

  useDisableBackground(renderDeletePostPopup, null);

  return (
    <div className="main-page">
      <div className="parent-nav">
        <Navbar />
      </div>
      {!isLoading && (
        <div className="home">
          <div className="home-left">
            <UnknownContacts />
          </div>
          <div className="home-middle">
            <PostFeed />
          </div>
          <div className="home-right">
            <FriendList />
          </div>
        </div>
      )}
      {renderDeletePostPopup && <DeletePostPopup />}
    </div>
  );
};

export default Home;
