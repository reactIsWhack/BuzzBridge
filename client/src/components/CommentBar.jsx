import { useEffect, useState } from 'react';
import '../styles/CommentBar.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import CommentBarTextarea from './CommentBarTextarea';

const CommentBar = ({ id }) => {
  const { profilePicture } = useSelector(selectUser);
  const [commentMessage, setCommentMessage] = useState('');

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
      <CommentBarTextarea
        id={id}
        commentMessage={commentMessage}
        setCommentMessage={setCommentMessage}
      />
    </div>
  );
};

export default CommentBar;
