import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLoggedInUserProfile,
  selectUser,
} from '../app/features/user/userSlice';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import Navbar from '../components/Navbar';

const Home = () => {
  useRedirectLoggedOutUser('/');
  const { isLoggedIn } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    isLoggedIn && dispatch(getLoggedInUserProfile());
  }, [isLoggedIn]);

  return (
    <>
      <Navbar />
      <h1>Home</h1>
    </>
  );
};

export default Home;
