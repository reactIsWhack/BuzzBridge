import React from 'react';
import '../styles/Comment.css';

const Comment = ({ commentMessage, author, likes, createdAt }) => {
  return (
    <div className="comment">
      <div className="comment-top">
        <img src={author.photo} />
        <div className="comment-content">
          <span>{author.firstName + ' ' + author.lastName}</span>
          <div>{commentMessage}</div>
        </div>
      </div>
      <div className="comment-actions">
        <div className="like-label">Like</div>
      </div>
    </div>
  );
};

export default Comment;
