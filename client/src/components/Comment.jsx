import { useState } from 'react';
import '../styles/Comment.css';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent } from '../app/features/posts/postsSlice';
import { selectUser } from '../app/features/user/userSlice';
import CommentLikesDesc from './CommentLikesDesc';
import ExpandedUsersLikedList from './ExpandedUsersLikedList';
import FullDateCreation from './FullDateCreation';
import HoverInfo from './HoverInfo';

const Comment = ({ commentMessage, author, likes, createdAt, _id, postId }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const userInLikedUsers = likes.usersLiked.find(
    (user) => String(user._id) === String(userId)
  );
  const [renderLikesList, setRenderLikesList] = useState(false); // determines if a list of users that liked a comment should be rendered.
  const startDate = new Date(Date.now());
  const endDate = new Date(createdAt);
  const [renderExactCreatedDate, setRenderExactCreatedDate] = useState(false); // determines if the full date of a comments createdAt should be rendered.
  const [fullDateMounted, setFullDateMounted] = useState(false); // used for creating smooth transition when the full date is rendered
  const [likedListMounted, setLikedListMounted] = useState(false);

  //  Gets time in days between the comment creation date and the current date
  let timeAgo = Math.round(
    (Date.parse(startDate) - Date.parse(endDate)) / (1000 * 60 * 60 * 24)
  );

  const renderTimeStamp = () => {
    if (timeAgo === 0) {
      // If the comment was made the day of the current date
      const hours = Math.floor((startDate - endDate) / (60 * 60 * 1000));
      if (hours < 1) {
        return 'just now'; // if the comment was just created
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
      // If the comment was made over a year ago, render the timestamp in years.
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

  const handleMouseOver = (e) => {
    setRenderLikesList(true);
    setLikedListMounted(true);
  }; // These functions toggle the rendering of the users liked list when the like icon of a comment is hovered.
  const handleMouseLeave = async (e) => {
    setLikedListMounted(false);
  };

  const renderDate = async (e) => {
    setRenderExactCreatedDate(true);
    setFullDateMounted(true);
  };
  const hideDate = (e) => {
    setFullDateMounted(false);
  };

  console.log(fullDateMounted);

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
              <CommentLikesDesc likes={likes} />
              {/* renders an icon that displays the number of likes for a comment */}
              {renderLikesList && (
                <HoverInfo
                  setRenderHoverWindow={setRenderLikesList}
                  className="expanded-users-liked-list"
                  isMounted={likedListMounted}
                >
                  <ExpandedUsersLikedList userList={likes.usersLiked} />
                </HoverInfo>
              )}
              {/* when the icon is hovered, this component renders a list of users that liked that comment */}
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
        <div
          className="timestamp-label"
          onMouseOver={renderDate}
          onMouseLeave={hideDate}
        >
          {renderTimeStamp()}
          {renderExactCreatedDate && (
            <HoverInfo
              isMounted={fullDateMounted}
              setRenderHoverWindow={setRenderExactCreatedDate}
              className="full-date"
              setIsMounted={setFullDateMounted}
            >
              <FullDateCreation createdAt={createdAt} />
            </HoverInfo>
          )}
          {/* HoverInfo is a  component that has the smooth transition of a div when conditionally rendered */}
        </div>
      </div>
    </div>
  );
};

export default Comment;
