import { useEffect, useState } from 'react';
import '../styles/CommentBar.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import createNewLine from '../utils/createNewLine';

const CommentBar = ({ id }) => {
  const { profilePicture } = useSelector(selectUser);
  const [commentMessage, setCommentMessage] = useState('');

  // Prevent default textarea behavior of creating a scrollbar for text when enter kery is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleInput = (e) => {
    createNewLine(true, e.target);
  };

  const handleChange = (e) => {
    setCommentMessage(e.target.value);
  };

  // Removes excess height from createNewLine when the comment message is entirely deleted

  useEffect(() => {
    if (!commentMessage) {
      console.log('ran');
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
      ></textarea>
    </div>
  );
};

export default CommentBar;
