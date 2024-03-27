import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const useRedirectLoggedOutUser = async () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Checks if the user is authorized access website routes.

  const getIsAuthorized = async () => {
    const response = await axios.get('/api/users/getloginstatus');

    console.log(response, 'redirectResponse');
    dispatch(setIsLoggedIn(response.data));

    // If the user is not authorized, redirect them to the login page so they cannot access any routes.
    if (!response.data) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    getIsAuthorized();
  }, []);
};
