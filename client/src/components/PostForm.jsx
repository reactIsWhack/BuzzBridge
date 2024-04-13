import React, { useEffect } from 'react';
import '../styles/PostForm.css';
import closeIcon from '../assets/closeIcon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const PostForm = ({ toggleModal, renderModal }) => {
  const { name, profilePicture } = useSelector(selectUser);

  return (
    <div className="post-modal-container">
      <div className="post-modal-top">
        <div className="post-close-icon">
          <img src={closeIcon} onClick={toggleModal} />
        </div>
        <h2>Create Post</h2>
      </div>
      <div className="modal-border"></div>
      <div className="post-form-section">
        <div className="post-author-information">
          <img src={profilePicture} className="post-form-photo" />
          <div>
            <span>posting as</span>
            <strong>{name}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
