import axios from 'axios';

export const getPosts = async (dateQuery) => {
  const response = await axios.get(`/api/posts/allposts/${dateQuery}`);
  return response;
};

export const addPost = async (formData) => {
  const response = await axios.post('/api/posts', formData);
  return response;
};

export const deleteContent = async (id) => {
  const response = await axios.delete(`/api/posts/${id}`);
  return response;
};

export const likeContent = async (id, contentData) => {
  const response = await axios.patch(`/api/posts/likepost/${id}`, contentData);
  return response;
};
