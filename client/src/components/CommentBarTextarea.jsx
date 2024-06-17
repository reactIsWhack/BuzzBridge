import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../app/features/posts/postsSlice';
import createNewLine from '../utils/createNewLine';
import { removeEditedComment } from '../app/features/popup/popupSlice';

const CommentBarTextarea = ({
  id,
  commentMessage,
  setCommentMessage,
  isEditing,
}) => {
  const dispatch = useDispatch();

  // Prevent default textarea behavior of creating a scrollbar for text when enter kery is pressed
  const handleKeyDown = async (e) => {
    let requestCount = 0;
    if (e.key === 'Enter') {
      e.preventDefault();
      requestCount++;
      if (requestCount === 1) {
        dispatch(addComment({ id, commentMessage }));
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
  };

  const handleClick = () => {
    dispatch(removeEditedComment(id));
  };

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
        unselectable="on"
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
