import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Friends from './pages/Friends';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUnkownUsers,
  selectUser,
  getLoggedInUserProfile,
} from './app/features/user/userSlice';
import { getAllPosts, selectPosts } from './app/features/posts/postsSlice';
import UserProfile from './pages/UserProfile';

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectUser);
  const { postsIsLoading } = useSelector(selectPosts);
  const { pathname } = useLocation();

  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && pathname === '/') {
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
    if (isLoggedIn) {
      console.log('loading more posts...');
      dispatch(getUnkownUsers());
      dispatch(getAllPosts());
      dispatch(getLoggedInUserProfile());
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            <div>
              <Login />
            </div>
          }
        ></Route>
        <Route path="/friends" element={<Friends />}></Route>
        <Route path="/userprofile/:userId" element={<UserProfile />}></Route>
      </Routes>
    </>
  );
};

export default App;
