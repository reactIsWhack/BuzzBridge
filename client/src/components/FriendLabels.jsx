import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, unfriendUser } from '../app/features/user/userSlice';
import checkIcon from '../assets/checkIcon.svg';
import { MdPersonRemoveAlt1, MdPersonAddAlt1 } from 'react-icons/md';

const FriendLabels = () => {
  const { friends, viewingUserProfileInfo, isLoading } =
    useSelector(selectUser);
  const dispatch = useDispatch();

  const userIsFriend = friends.some(
    (friend) => String(friend._id) === String(viewingUserProfileInfo.userId)
  );

  const removeFriend = () =>
    dispatch(unfriendUser(viewingUserProfileInfo.userId));

  const removeFriendBtnStyles = {
    opacity: isLoading ? 0.6 : 1,
    cursor: isLoading ? 'default' : 'pointer',
  };

  return (
    <div className="friend-labels">
      {userIsFriend ? (
        <div className="friend-actions">
          <div className="friend-check">
            <img src={checkIcon} />
            Friend
          </div>
          <button
            className="remove-friend-btn"
            onClick={removeFriend}
            style={removeFriendBtnStyles}
            disabled={isLoading ? true : false}
          >
            <MdPersonRemoveAlt1 size={21} />
            <span>Unfriend</span>
          </button>
        </div>
      ) : (
        <button className="add-friend-btn">
          <MdPersonAddAlt1 size={21} />
          <span>Add Friend</span>
        </button>
      )}
    </div>
  );
};

export default FriendLabels;
