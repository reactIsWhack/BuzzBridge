import { useState } from 'react';
import '../styles/PostOptions.css';
import editIcon from '../assets/editIcon.svg';
import deleteIcon from '../assets/deleteIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setDeletePostPopup } from '../app/features/popup/popupSlice';
import { deleteComment } from '../app/features/posts/postsSlice';

const PostOptions = ({
  setRenderPostOptions,
  renderPostOptions,
  className,
  commentId,
  postId,
}) => {
  const dispatch = useDispatch();
  const content = className === 'comment-options' ? 'comment' : 'post';

  const toggleDeletePopup = async () => {
    if (content === 'post') {
      dispatch(setDeletePostPopup(true));
    } else {
      dispatch(deleteComment({ commentId, postId }));
    }
    setRenderPostOptions(false);
  };

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
