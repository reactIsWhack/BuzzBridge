import React from 'react';

const ExpandedUsersLikedList = ({ userList }) => {
  const userName = userList.map((user) => {
    return (
      <div className="user-list-item">
        {user.firstName + ' ' + user.lastName}
      </div>
    );
  });

  return <div className="expanded-users-liked-list">{userName}</div>;
};

export default ExpandedUsersLikedList;
