import axios from 'axios';

export const createUser = async (formData) => {
  const response = await axios.post('/api/users/registeruser', formData);
  return response;
};

export const getPersonalProfile = async () => {
  const response = await axios.get('/api/users/user');
  return response;
};

export const login = async (formData) => {
  const response = await axios.post('/api/users/loginuser', formData);
  return response;
};

export const logout = async () => {
  const response = await axios.get('/api/users/logoutuser');
  return response;
};

export const getUsers = async () => {
  const skip = Math.floor(Math.random() * (41 - 0) + 0);
  const response = await axios.get(`/api/users/allusers/${skip}`);
  return response;
};

export const acceptFriend = async (userId) => {
  const response = await axios.patch(
    `/api/users/acceptfriendrequest/${userId}`
  );
  return response;
};

export const declineRequest = async (userId) => {
  const response = await axios.patch(
    `/api/users/declinefriendrequest/${userId}`
  );
  return response;
};

export const getProfile = async (userId) => {
  const response = await axios.get(`/api/users/userprofile/${userId}`);
  return response;
};

export const getProfilePosts = async (userId, dateQuery) => {
  const response = await axios.get(
    `/api/posts/userposts/${userId}/${dateQuery}`
  );
  return response;
};

export const updateUser = async (updatedData) => {
  const response = await axios.patch('/api/users/update', updatedData);
  return response;
};

export const unfriend = async (friendId) => {
  const response = await axios.patch(`/api/users/removefriend/${friendId}`);
  return response;
};
