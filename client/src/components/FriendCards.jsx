import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import sortNamesAlphabetically from '../utils/sortNamesAlphatbetically';
import UserBlock from './UserBlock';

const FriendCards = () => {
  const { friends } = useSelector(selectUser);
  const friendsSorted = sortNamesAlphabetically(friends);

  const userCard = friendsSorted.map((friend) => {
    return <UserBlock key={friend._id} {...friend} />;
  });

  return (
    <div className="friend-cards">
      <h2 className="friend-list-header">Friends</h2>
      <div className="user-cards-container">{userCard}</div>
    </div>
  );
};

export default FriendCards;
