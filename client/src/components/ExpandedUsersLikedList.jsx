import React from 'react';

const ExpandedUsersLikedList = ({ userList }) => {
  const userName = userList.map((user) => {
    return (
      <div key={user._id} className="user-list-item">
        {user.firstName + ' ' + user.lastName}
      </div>
    );
  });

  return <>{userName}</>;
};

export default ExpandedUsersLikedList;
