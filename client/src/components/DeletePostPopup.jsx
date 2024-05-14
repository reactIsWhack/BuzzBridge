import React from 'react';
import Modal from './Modal';
import closeIcon from '../assets/closeIcon.svg';
import { useDispatch } from 'react-redux';
import { setDeletePostPopup } from '../app/features/popup/popupSlice';
import { deletePost, removePost } from '../app/features/posts/postsSlice';

const DeletePostPopup = () => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setDeletePostPopup(false));

  const handleDelete = () => {
    dispatch(setDeletePostPopup(false));
    // Remove the post from the posts array immediately first rather than waiting for the api call to finish to improve user experience.
    dispatch(removePost());
    dispatch(deletePost());
  };

  return (
    <div className="delete-post-modal">
      <Modal>
        <>
          <div className="modal-top">
            <div className="modal-close-icon" onClick={handleClick}>
              <img src={closeIcon} />
            </div>
            <h2>Delete this post?</h2>
          </div>
          <div className="modal-border"></div>
          <div className="modal-bottom">
            <div className="delete-post-warning">
              Are you sure you want to delete this post forever? This action
              cannot be undone.
            </div>
            <div className="delete-modal-btns">
              <button className="cancel-btn" onClick={handleClick}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default DeletePostPopup;
