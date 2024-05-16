import React from 'react';
import likeIcon from '../assets/likeIcon.svg';
import commentIcon from '../assets/commentIcon.svg';
import '../styles/PostActions.css';

export const PostActions = () => {
  return (
    <div className="post-actions">
      <div className="like-action-container">
        <img src={likeIcon} />
        <div>Like</div>
      </div>
      <div className="comment-action-container">
        <img src={commentIcon} />
        <div>Comment</div>
      </div>
    </div>
  );
};
