import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserCard from './UserCard';

const UnknownContacts = () => {
  // Logged in user's information to put on their card
  const { unknownUsers, name, profilePicture, userId } =
    useSelector(selectUser);

  const unknownUserCards = unknownUsers.map((user) => (
    <UserCard key={user._id} {...user} />
  ));

  return (
    <>
      <UserCard name={name} photo={profilePicture} _id={userId} />
      <h3>People you may know</h3>
      <div className="unknown-contacts-container">{unknownUserCards}</div>
    </>
  );
};

export default UnknownContacts;
