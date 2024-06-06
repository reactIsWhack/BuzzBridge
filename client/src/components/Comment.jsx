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
  const timeSeperation = startDate.getTime() - endDate.getTime();
  let timeStamp = Math.round(timeSeperation / (1000 * 3600 * 24));
  console.log(timeStamp);

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
      </div>
    </div>
  );
};

export default Comment;
