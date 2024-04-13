import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Friends from './pages/Friends';
import { useDispatch, useSelector } from 'react-redux';
import { getUnkownUsers, selectUser } from './app/features/user/userSlice';
import { getAllPosts } from './app/features/posts/postsSlice';

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUnkownUsers());
      dispatch(getAllPosts());
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
      </Routes>
    </>
  );
};

export default App;
