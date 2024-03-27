import axios from 'axios';

export const createUser = async (formData) => {
  const response = await axios.post('/api/users/registeruser', formData);
  return response;
};

export const getPersonalProfile = async () => {
  const response = await axios.get('/api/users/user/0');
  return response;
};

export const logout = async () => {
  const response = await axios.get('/api/users/logoutuser');
  return response;
};
