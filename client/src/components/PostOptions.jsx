import { useState } from 'react';
import '../styles/PostOptions.css';
import editIcon from '../assets/editIcon.svg';
import deleteIcon from '../assets/deleteIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setDeletePostPopup } from '../app/features/popup/popupSlice';

const PostOptions = ({
  setRenderPostOptions,
  renderPostOptions,
  className,
}) => {
  const dispatch = useDispatch();

  const toggleDeletePopup = async () => {
    if (className !== 'comment-options') {
      setRenderPostOptions(false);
      dispatch(setDeletePostPopup(true));
    }
    // window.scrollTo(0, 0);
  };
  const content = className === 'comment-options' ? 'comment' : 'post';

  return (
    <>
      <div className={`${content}-menu-container`}>
        <div className="edit-post-option">
          <img src={editIcon} />
          <div>Edit {content}</div>
        </div>
        <div className="delete-post-option" onClick={toggleDeletePopup}>
          <img src={deleteIcon} />
          <div>Delete {content}</div>
        </div>
      </div>
    </>
  );
};

export default PostOptions;
