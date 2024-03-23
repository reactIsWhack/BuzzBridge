import React, { useDebugValue, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  useRedirectLoggedOutUser();
  const user = useSelector(selectUser);

  return <h1>Home</h1>;
};

export default Home;
