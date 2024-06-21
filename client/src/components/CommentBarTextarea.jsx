import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, editComment } from '../app/features/posts/postsSlice';
import createNewLine from '../utils/createNewLine';
import { removeEditedComment } from '../app/features/popup/popupSlice';

const CommentBarTextarea = ({
  id,
  commentMessage,
  setCommentMessage,
  isEditing,
  postId,
}) => {
  const dispatch = useDispatch();

  // Prevent default textarea behavior of creating a scrollbar for text when enter kery is pressed
  const handleKeyDown = async (e) => {
    let requestCount = 0;
    if (e.key === 'Enter') {
      e.preventDefault();
      requestCount++;
      if (requestCount === 1) {
        if (isEditing) {
          await dispatch(
            editComment({
              commentId: id,
              commentData: {
                contentMessage: commentMessage,
                contentType: 'comment',
              },
              updatedPostId: postId,
            })
          );
          dispatch(removeEditedComment(id));
        } else {
          dispatch(addComment({ id, commentMessage }));
        }
      }
      await setCommentMessage('');
    }
  };

  const handleInput = (e) => {
    if (!e.key === 'Enter') {
      createNewLine(true, e.target);
    }
  };

  const handleChange = (e) => {
    if (e.key === 'enter') {
      return;
    }
    setCommentMessage(e.target.value);
    createNewLine(true, e.target);
  };

  const handleClick = () => {
    dispatch(removeEditedComment(id));
  };

  useEffect(() => {
    if (isEditing) {
      const element = document.getElementById(`comment-textarea-${id}`);
      element.style.height = 'auto';
      console.log(element.scrollHeight);
      element.style.height = element.scrollHeight + 'px';
    }
  }, [isEditing, commentMessage]);

  return (
    <div className="edit-comment-form">
      <textarea
        maxLength={1500}
        placeholder={isEditing ? '' : 'Write a comment...'}
        rows={1}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        id={`comment-textarea-${id}`} // the id of the post or comment to identify the unique textarea
        onChange={handleChange}
        value={commentMessage}
      ></textarea>
      {isEditing && (
        <div className="edit-cancel-btn" onClick={handleClick}>
          Cancel
        </div>
      )}
    </div>
  );
};

export default CommentBarTextarea;
