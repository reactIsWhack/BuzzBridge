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

const Home = () => {
  useRedirectLoggedOutUser('/');
  const { renderDeletePostPopup } = useSelector(selectPopup);

  useDisableBackground(renderDeletePostPopup, null);

  return (
    <div className="main-page">
      <Navbar />
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
      {renderDeletePostPopup && <DeletePostPopup />}
    </div>
  );
};

export default Home;
