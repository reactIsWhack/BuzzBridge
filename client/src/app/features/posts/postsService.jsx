import axios from 'axios';

export const getPosts = async (dateQuery) => {
  const response = await axios.get(`/api/posts/allposts/${dateQuery}`);
  return response;
};

export const addPost = async (formData) => {
  const response = await axios.post('/api/posts', formData);
  return response;
};
