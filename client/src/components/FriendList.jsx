import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserCard from './UserCard';
import sortNamesAlphabetically from '../utils/sortNamesAlphatbetically';

const FriendList = () => {
  const { friends } = useSelector(selectUser);
  const sortedFriends = sortNamesAlphabetically(friends);
  // console.log(sortedFriends);

  const friendCard = sortedFriends.map((friend) => (
    <UserCard key={friend._id} {...friend} />
  ));

  return (
    <div className="friend-list">
      <span>Contacts</span>
      <div className="friends">{friendCard}</div>
    </div>
  );
};

export default FriendList;
