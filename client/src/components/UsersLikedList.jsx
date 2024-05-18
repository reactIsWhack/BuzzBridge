import { useState } from 'react';
import whiteLikeIcon from '../assets/likeIconWhite.svg';
import ExpandedUsersLikedList from './ExpandedUsersLikedList';

const UsersLikedList = ({ likes: { usersLiked } }) => {
  const [firstUser, secondUser] = usersLiked;
  const [renderExpandedList, setRenderExpandedList] = useState(false);

  const firstUserName = firstUser.firstName + ' ' + firstUser.lastName;
  let secondUserName = '';
  if (secondUser) {
    secondUserName = secondUser.firstName + ' ' + secondUser.lastName;
  }
  const remainingUsers = usersLiked.length - 2;

  const renderList = () => {
    if (usersLiked.length > 2) {
      return (
        <div>
          {firstUserName}, {secondUserName}, <span>and</span> {remainingUsers}{' '}
          <span>{remainingUsers === 1 ? 'other' : 'others'}</span>
        </div>
      );
    } else if (usersLiked.length === 1) {
      return firstUserName;
    } else {
      return (
        <div>
          {firstUserName} <span>and</span> {secondUserName}
        </div>
      );
    }
  };

  const handleMouseOver = () => setRenderExpandedList(true);
  const handleMouseLeave = () => setRenderExpandedList(false);

  const userListStyles = {
    textDecoration: renderExpandedList ? 'underline' : 'none',
  };

  return (
    <div className="users-liked-list">
      <div
        className="list-container"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <div className="white-like-bg">
          <img src={whiteLikeIcon} />
        </div>
        <div className="list" style={userListStyles}>
          {renderList()}
        </div>
        {renderExpandedList && <ExpandedUsersLikedList userList={usersLiked} />}
      </div>
    </div>
  );
};

export default UsersLikedList;
