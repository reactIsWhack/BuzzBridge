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
    if (document.getElementById(id + 'like')) {
      document.getElementById(id + 'like').animate(
        [
          { transform: 'rotate(0deg)', height: '22px' },
          { transform: 'rotate(-10deg)', height: '26px' },
        ],
        {
          duration: 400,
          // fill: 'forwards',
          easing: 'ease',
        }
      );
    }
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

  const handleClick = () => {
    document.getElementById(`comment-textarea-${id}`).focus();
    document.getElementById(`comment-textarea-${id}`).select();
  };

  return (
    <div className="post-actions">
      <div className="like-action-container" onClick={editLike}>
        {userInLikedUsers ? (
          <img src={likedIconFilled} />
        ) : (
          <img src={likeIcon} id={id + 'like'} />
        )}
        <div style={likeTextStyles}>Like</div>
      </div>
      <div className="comment-action-container" onClick={handleClick}>
        <img src={commentIcon} />
        <div>Comment</div>
      </div>
    </div>
  );
};
