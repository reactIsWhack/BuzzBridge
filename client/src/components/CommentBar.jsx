import { useEffect, useState } from 'react';
import '../styles/CommentBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import createNewLine from '../utils/createNewLine';
import { addComment } from '../app/features/posts/postsSlice';

const CommentBar = ({ id }) => {
  const { profilePicture } = useSelector(selectUser);
  const [commentMessage, setCommentMessage] = useState('');
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

  // Removes excess height from createNewLine when the comment message is entirely deleted

  useEffect(() => {
    if (!commentMessage) {
      document
        .getElementById(`comment-textarea-${id}`)
        .style.removeProperty('height');
    }
  }, [commentMessage]);

  return (
    <div className="comment-bar-container">
      <img src={profilePicture} alt="profile-picture" />
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
    </div>
  );
};

export default CommentBar;
