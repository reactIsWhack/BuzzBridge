import axios from 'axios';

export const getPosts = async (dateQuery) => {
  const response = await axios.get(`/api/posts/allposts/${dateQuery}`);
  return response;
};
