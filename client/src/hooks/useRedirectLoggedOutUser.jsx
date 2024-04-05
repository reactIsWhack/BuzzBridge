import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setIsLoggedIn } from '../app/features/user/userSlice';

export const useRedirectLoggedOutUser = async (route) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Checks if the user is authorized access website routes.

  const getIsAuthorized = async () => {
    const response = await axios.get('/api/users/getloginstatus');

    dispatch(setIsLoggedIn(response.data));

    // If the user is not authorized, redirect them to the login page so they cannot access any routes.
    if (!response.data) {
      navigate('/login');
    } else {
      navigate(route);
    }
  };

  useEffect(() => {
    getIsAuthorized();
  }, []);
};
