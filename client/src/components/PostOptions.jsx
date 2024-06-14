import { useState } from 'react';
import '../styles/PostOptions.css';
import editIcon from '../assets/editIcon.svg';
import deleteIcon from '../assets/deleteIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDeletePostPopup,
  setRenderPostFormModal,
} from '../app/features/popup/popupSlice';
import { deleteComment, selectPosts } from '../app/features/posts/postsSlice';

const PostOptions = ({
  setRenderPostOptions,
  renderPostOptions,
  className,
  commentId,
  postId,
}) => {
  const dispatch = useDispatch();
  const content = className === 'comment-options' ? 'comment' : 'post';
  const { posts } = useSelector(selectPosts);

  const toggleDeletePopup = async () => {
    if (content === 'post') {
      dispatch(setDeletePostPopup(true));
    } else {
      dispatch(deleteComment({ commentId, postId }));
    }
    setRenderPostOptions(false);
  };

  const renderEditPostForm = () => {
    const editedPost = posts.find(
      (post) => String(post._id) === String(postId)
    );
    dispatch(
      setRenderPostFormModal({
        render: true,
        editing: true,
        editedPost: editedPost,
      })
    );
  };

  return (
    <>
      <div className={`${content}-menu-container`}>
        <div className="edit-post-option" onClick={renderEditPostForm}>
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
