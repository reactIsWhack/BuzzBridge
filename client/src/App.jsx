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
import ProfileMainContent from './pages/ProfileMainContent';
import ProfileFriends from './components/ProfileFriends';

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, viewingUserProfileInfo } = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      console.log('loading more posts...');
      dispatch(getUnkownUsers());
      dispatch(getAllPosts());
      dispatch(getLoggedInUserProfile());
    }
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
        <Route path="/userprofile/:userId" element={<UserProfile />}>
          <Route index element={<ProfileMainContent />}></Route>
          <Route path="friends" element={<ProfileFriends />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
