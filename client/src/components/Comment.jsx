import React from 'react';
import '../styles/Comment.css';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent } from '../app/features/posts/postsSlice';
import { selectUser } from '../app/features/user/userSlice';

const Comment = ({ commentMessage, author, likes, createdAt, _id, postId }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const userInLikedUsers = likes.usersLiked.find(
    (user) => String(user._id) === String(userId)
  );

  const likeComment = () => {
    dispatch(
      likeContent({
        id: _id,
        contentData: { isLiking: true, content: 'comment' },
        postId,
      })
    );
  };

  const likeLabelStyles = {
    color: userInLikedUsers ? '#2078f4' : '#65676b',
  };

  return (
    <div className="comment">
      <div className="comment-top">
        <img src={author.photo} />
        <div className="comment-content">
          <span>{author.firstName + ' ' + author.lastName}</span>
          <div>{commentMessage}</div>
        </div>
      </div>
      <div className="comment-actions">
        <div
          className="like-label"
          onClick={likeComment}
          style={likeLabelStyles}
        >
          Like
        </div>
      </div>
    </div>
  );
};

export default Comment;
