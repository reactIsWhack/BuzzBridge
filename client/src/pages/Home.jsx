import React, { useEffect } from 'react';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import Navbar from '../components/Navbar';
import UnknownContacts from '../components/UnknownContacts';
import '../styles/Home.css';
import PostFeed from '../components/PostFeed';
import FriendList from '../components/FriendList';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopup } from '../app/features/popup/popupSlice';
import DeletePostPopup from '../components/DeletePostPopup';
import useDisableBackground from '../hooks/useDisableBackground';
import { resetViewingUser, selectUser } from '../app/features/user/userSlice';
import { getAllPosts, selectPosts } from '../app/features/posts/postsSlice';

const Home = () => {
  useRedirectLoggedOutUser('/');
  const { renderDeletePostPopup } = useSelector(selectPopup);
  const { isLoading } = useSelector(selectUser);
  const { postsIsLoading, noMorePosts } = useSelector(selectPosts);
  const dispatch = useDispatch();

  useDisableBackground(renderDeletePostPopup, null);

  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) {
      window.removeEventListener('scroll', handleScroll);

      await dispatch(getAllPosts());
      if (!postsIsLoading) {
        window.addEventListener('scroll', handleScroll, {
          passive: true,
        });
      }
    }
  };

  useEffect(() => {
    dispatch(resetViewingUser());
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          <div
            className="home-middle"
            onScroll={() => console.log('scrolling')}
          >
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
