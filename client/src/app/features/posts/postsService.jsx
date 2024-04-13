import axios from 'axios';

export const getPosts = async (userPostsSkip, postsSkip) => {
  const response = await axios.get(
    `/api/posts/allposts/${postsSkip}/${userPostsSkip}`
  );
  return response;
};
