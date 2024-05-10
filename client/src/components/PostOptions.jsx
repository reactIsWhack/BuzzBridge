import React from 'react';
import '../styles/PostOptions.css';
import editIcon from '../assets/editIcon.svg';
import deleteIcon from '../assets/deleteIcon.svg';

const PostOptions = () => {
  return (
    <div className="post-menu-container">
      <div className="edit-post-option">
        <img src={editIcon} />
        <div>Edit Post</div>
      </div>
      <div className="delete-post-option">
        <img src={deleteIcon} />
        <div>Delete Post</div>
      </div>
    </div>
  );
};

export default PostOptions;
