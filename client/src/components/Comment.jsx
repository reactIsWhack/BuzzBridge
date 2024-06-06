import { useState } from 'react';
import '../styles/Comment.css';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent } from '../app/features/posts/postsSlice';
import { selectUser } from '../app/features/user/userSlice';
import CommentLikesDesc from './CommentLikesDesc';
import ExpandedUsersLikedList from './ExpandedUsersLikedList';

const Comment = ({ commentMessage, author, likes, createdAt, _id, postId }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const userInLikedUsers = likes.usersLiked.find(
    (user) => String(user._id) === String(userId)
  );
  const [renderLikesList, setRenderLikesList] = useState(false);
  const startDate = new Date(Date.now());
  // Do your operations
  const endDate = new Date(createdAt);

  //  Gets time in days between the comment creation date and the current date
  let timeAgo = Math.round(
    (Date.parse(startDate) - Date.parse(endDate)) / (1000 * 60 * 60 * 24)
  );

  const renderTimeStamp = () => {
    if (timeAgo === 0) {
      const hours = Math.floor((startDate - endDate) / (60 * 60 * 1000));
      if (hours < 1) {
        return 'just now';
      }
      return `${hours}h`;
    } else if (timeAgo < 7) {
      // If the comment was made less than a week ago, render the timestamp in days.
      return `${timeAgo}d`;
    } else if (timeAgo > 7 && timeAgo <= 31) {
      // If the comment was made less than a month ago, then render the timestamp in weeks.
      return `${Math.floor(timeAgo / 7)}w`;
    } else if (timeAgo > 31 && timeAgo < 365) {
      // renders the timestamp in months if it was made over a month ago
      let months;
      months = (startDate.getFullYear() - endDate.getFullYear()) * 12;
      months -= endDate.getMonth();
      months += startDate.getMonth();
      return `${months}m`;
    } else {
      const ageDifMs = startDate - endDate;
      const ageDate = new Date(ageDifMs); // miliseconds from epoch
      return `${Math.abs(ageDate.getUTCFullYear() - 1970)}y`;
    }
  };

  const likeComment = () => {
    dispatch(
      likeContent({
        id: _id,
        contentData: {
          isLiking: userInLikedUsers ? false : true,
          content: 'comment',
        },
        postId,
      })
    );
  };

  const likeLabelStyles = {
    color: userInLikedUsers ? '#2078f4' : '#65676b',
  };

  const handleMouseOver = () => setRenderLikesList(true);
  const handleMouseLeave = () => setRenderLikesList(false);

  return (
    <div className="comment">
      <div className="comment-top">
        <img src={author.photo} />
        <div className="comment-content">
          <span>{author.firstName + ' ' + author.lastName}</span>
          <div className="comment-message">{commentMessage}</div>
          {likes.total > 0 && (
            <div
              className="comments-like-section"
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                {' '}
                <CommentLikesDesc likes={likes} />
              </div>

              <div>
                {renderLikesList && (
                  <ExpandedUsersLikedList userList={likes.usersLiked} />
                )}
              </div>
            </div>
          )}
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
        <div className="timestamp-label">{renderTimeStamp()}</div>
      </div>
    </div>
  );
};

export default Comment;
