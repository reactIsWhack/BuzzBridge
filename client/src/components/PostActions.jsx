import React from 'react';
import likeIcon from '../assets/likeIcon.svg';
import commentIcon from '../assets/commentIcon.svg';
import '../styles/PostActions.css';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../app/features/posts/postsSlice';
import { selectUser } from '../app/features/user/userSlice';
import likedIconFilled from '../assets/likeIconFilled.svg';

export const PostActions = ({ likes, id }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const userInLikedUsers = likes.usersLiked.find(
    (user) => String(user._id) === String(userId)
  );

  const editLike = () => {
    dispatch(
      likePost({
        id,
        contentData: {
          isLiking: userInLikedUsers ? false : true,
          content: 'post',
        },
      })
    );
  };

  const likeTextStyles = {
    color: userInLikedUsers ? '#2078f4' : '#65676b',
  };

  return (
    <div className="post-actions">
      <div className="like-action-container" onClick={editLike}>
        {userInLikedUsers ? (
          <img src={likedIconFilled} />
        ) : (
          <img src={likeIcon} />
        )}
        <div style={likeTextStyles}>Like</div>
      </div>
      <div className="comment-action-container">
        <img src={commentIcon} />
        <div>Comment</div>
      </div>
    </div>
  );
};
