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

  return (
    <>
      <Navbar />
    </>
  );
};

export default Home;
