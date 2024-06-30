import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  sendFriendRequest,
  unfriendUser,
} from '../app/features/user/userSlice';
import checkIcon from '../assets/checkIcon.svg';
import { MdPersonRemoveAlt1, MdPersonAddAlt1 } from 'react-icons/md';

const FriendLabels = () => {
  const { friends, viewingUserProfileInfo, isLoading, userId, friendRequests } =
    useSelector(selectUser);
  const dispatch = useDispatch();

  const userIsFriend = friends.some(
    (friend) => String(friend._id) === String(viewingUserProfileInfo.userId)
  );

  const removeFriend = () =>
    dispatch(unfriendUser(viewingUserProfileInfo.userId));
  const requestFriend = () =>
    dispatch(sendFriendRequest(viewingUserProfileInfo.userId));

  const labelBtnStyles = {
    opacity: isLoading ? 0.6 : 1,
    cursor: isLoading ? 'default' : 'pointer',
  };

  const userInFriendRequests = friendRequests.some(
    (request) => String(request._id) === String(viewingUserProfileInfo.userId)
  );
  const requestSentToViewingUser = viewingUserProfileInfo.friendRequests.some(
    (request) => String(request._id) === String(userId)
  );

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
            style={labelBtnStyles}
            disabled={isLoading ? true : false}
          >
            <MdPersonRemoveAlt1 size={21} />
            <span>Unfriend</span>
          </button>
        </div>
      ) : (
        <>
          {userInFriendRequests ? (
            <div className="friend-request-options">
              <button className="add-friend-btn">
                <MdPersonAddAlt1 size={21} />
                <span>Accept Request</span>
              </button>
              <button className="remove-friend-btn">
                <MdPersonRemoveAlt1 size={21} />
                <span>Deny Request</span>
              </button>
            </div>
          ) : (
            <button
              className="add-friend-btn"
              style={labelBtnStyles}
              onClick={requestFriend}
              disabled={isLoading ? true : false}
            >
              {requestSentToViewingUser ? (
                <MdPersonRemoveAlt1 size={21} />
              ) : (
                <MdPersonAddAlt1 size={21} />
              )}
              <span>
                {requestSentToViewingUser ? 'Cancel Request' : 'Add Friend'}
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FriendLabels;
