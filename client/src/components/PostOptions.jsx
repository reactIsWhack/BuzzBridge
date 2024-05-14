import { useState } from 'react';
import '../styles/PostOptions.css';
import editIcon from '../assets/editIcon.svg';
import deleteIcon from '../assets/deleteIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setDeletePostPopup } from '../app/features/popup/popupSlice';

const PostOptions = ({ setRenderPostOptions, renderPostOptions }) => {
  const dispatch = useDispatch();

  const toggleDeletePopup = async () => {
    setRenderPostOptions(false);
    dispatch(setDeletePostPopup(true));
    // window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="post-menu-container">
        <div className="edit-post-option">
          <img src={editIcon} />
          <div>Edit Post</div>
        </div>
        <div className="delete-post-option" onClick={toggleDeletePopup}>
          <img src={deleteIcon} />
          <div>Delete Post</div>
        </div>
      </div>
    </>
  );
};

export default PostOptions;
