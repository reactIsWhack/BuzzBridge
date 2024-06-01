import React from 'react';
import '../styles/CommentLikesDesc.css';
import LikeGradientIcon from './LikeGradientIcon';

const CommentLikesDesc = ({ likes }) => {
  return (
    <div className="comment-like-desc">
      <LikeGradientIcon />
      <div className="comment-like-total">{likes.total}</div>
    </div>
  );
};

export default CommentLikesDesc;
