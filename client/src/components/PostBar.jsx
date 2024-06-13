import React, { useState } from 'react';
import '../styles/PostBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import Modal from './Modal';
import PostForm from './PostForm';
import {
  selectPopup,
  setRenderPostFormModal,
} from '../app/features/popup/popupSlice';

const PostBar = () => {
  const { firstName, profilePicture } = useSelector(selectUser);
  const { renderPostFormModal } = useSelector(selectPopup);
  const dispatch = useDispatch();

  return (
    <>
      <div className="post-modal">
        {renderPostFormModal && (
          <Modal>
            <PostForm renderModal={renderPostFormModal} />
          </Modal>
        )}
      </div>

      <div
        className="post-form"
        onClick={() => dispatch(setRenderPostFormModal(true))}
      >
        <img src={profilePicture} alt="profile-picture" />
        <div>
          What's on your mind, <span>{firstName}</span>?
        </div>
      </div>
    </>
  );
};

export default PostBar;
