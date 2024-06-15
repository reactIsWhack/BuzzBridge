import React from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../app/features/posts/postsSlice';
import createNewLine from '../utils/createNewLine';

const CommentBarTextarea = ({ id, commentMessage, setCommentMessage }) => {
  const dispatch = useDispatch();

  // Prevent default textarea behavior of creating a scrollbar for text when enter kery is pressed
  const handleKeyDown = async (e) => {
    let requestCount = 0;
    if (e.key === 'Enter') {
      e.preventDefault();
      requestCount++;
      if (commentMessage && requestCount === 1) {
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

  return (
    <textarea
      maxLength={1500}
      placeholder="Write a comment..."
      rows={1}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      id={`comment-textarea-${id}`}
      onChange={handleChange}
      value={commentMessage}
    ></textarea>
  );
};

export default CommentBarTextarea;
