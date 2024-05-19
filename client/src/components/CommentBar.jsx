import React from 'react';
import '../styles/CommentBar.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const CommentBar = () => {
  const { profilePicture } = useSelector(selectUser);

  return (
    <div className="comment-bar-container">
      <img src={profilePicture} alt="profile-picture" />
      <textarea
        maxLength={1500}
        placeholder="Write a comment..."
        rows={1}
      ></textarea>
    </div>
  );
};

export default CommentBar;
