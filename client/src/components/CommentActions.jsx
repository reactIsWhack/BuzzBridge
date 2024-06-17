import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent } from '../app/features/posts/postsSlice';
import { selectUser } from '../app/features/user/userSlice';
import FullDateCreation from './FullDateCreation';
import HoverInfo from './HoverInfo';

const CommentActions = ({ createdAt, _id, postId, usersLiked }) => {
  const dispatch = useDispatch();
  const [renderExactCreatedDate, setRenderExactCreatedDate] = useState(false); // determines if the full date of a comments createdAt should be rendered.
  const [fullDateMounted, setFullDateMounted] = useState(false); // used for creating smooth transition when the full date is rendered
  const { userId } = useSelector(selectUser); // gets the id of the logged in user

  const userInLikedUsers = usersLiked.find(
    (user) => String(user._id) === String(userId)
  );

  const startDate = new Date(Date.now());
  const endDate = new Date(createdAt);
  //  Gets time in days between the comment creation date and the current date
  let timeAgoRounded = (
    (Date.parse(startDate) - Date.parse(endDate)) /
    (1000 * 60 * 60 * 24)
  ).toFixed(1);
  const timeAgo = Number(Number(timeAgoRounded).toFixed(0));

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
    } else if (timeAgo >= 7 && timeAgo <= 31) {
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

  const renderDate = async () => {
    if (!fullDateMounted && !renderExactCreatedDate) {
      setRenderExactCreatedDate(true);
      setFullDateMounted(true);
    }
  };
  const hideDate = () => {
    setFullDateMounted(false);
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

  return (
    <div className="comment-actions">
      <div className="like-label" onClick={likeComment} style={likeLabelStyles}>
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
  );
};

export default CommentActions;
