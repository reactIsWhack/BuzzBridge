import React, { useState } from 'react';
import '../styles/PostBar.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import Modal from './Modal';
import PostForm from './PostForm';

const PostBar = () => {
  const { firstName, profilePicture } = useSelector(selectUser);
  const [renderModal, setRenderModal] = useState(false);

  const toggleModal = () =>
    setRenderModal((prevRenderModal) => !prevRenderModal);

  return (
    <>
      {renderModal && (
        <div className="post-modal">
          <Modal>
            <PostForm toggleModal={toggleModal} renderModal={renderModal} />
          </Modal>
        </div>
      )}
      <div className="post-form" onClick={toggleModal}>
        <img src={profilePicture} alt="profile-picture" />
        <div>
          What's on your mind, <span>{firstName}</span>?
        </div>
      </div>
    </>
  );
};

export default PostBar;
