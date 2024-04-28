import React from 'react';
import { useSelector } from 'react-redux';
import { selectPosts } from '../app/features/posts/postsSlice';
import Post from './Post';
import PostBar from './PostBar';

const PostFeed = () => {
  const { posts, postsIsLoading } = useSelector(selectPosts);

  const postCard = posts.map((post) => <Post key={post._id} {...post} />);

  return (
    <>
      <PostBar />
      <div>
        <div className="feed">{postCard}</div>
        {postsIsLoading && <div className="post-loader-spinner"></div>}
      </div>
    </>
  );
};

export default PostFeed;
