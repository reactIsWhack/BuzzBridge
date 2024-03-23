import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useRedirectLoggedOutUser = async () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Checks if the user is authorized access website routes.

  const getIsAuthorized = async () => {
    const { data } = await axios.get(
      'http://localhost:3000/api/users/getloginstatus'
    );

    dispatch(setIsLoggedIn(data));

    // If the user is not authorized, redirect them to the login page so they cannot access any routes.
    if (!data) {
      navigate('/login');
    }
  };

  useEffect(() => {
    getIsAuthorized();
  }, []);
};
