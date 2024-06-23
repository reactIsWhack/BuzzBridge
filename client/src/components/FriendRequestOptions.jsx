import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptfriendrequest,
  declineFriendRequest,
  selectUser,
} from '../app/features/user/userSlice';

const FriendRequestOptions = ({ _id }) => {
  const dispatch = useDispatch();

  const disableButtons = () => {
    const confirmBtn = document.querySelector(`.confirm-btn-${_id}`);
    const declineBtn = document.querySelector(`.decline-btn-${_id}`);
    confirmBtn.style = 'opacity: 0.6; cursor: auto';
    declineBtn.style = 'opacity: 0.6; cursor: auto';
    confirmBtn.disabled = true;
    declineBtn.disabled = true;
  };

  const acceptRequest = (e) => {
    disableButtons();
    dispatch(acceptfriendrequest(_id));
  };

  const declineRequest = () => {
    disableButtons();
    dispatch(declineFriendRequest(_id));
  };

  return (
    <>
      <button
        className={`confirm-btn confirm-btn-${_id}`}
        onClick={acceptRequest}
      >
        Confirm
      </button>
      <button
        className={`decline-btn decline-btn-${_id}`}
        onClick={declineRequest}
      >
        Delete
      </button>
    </>
  );
};

export default FriendRequestOptions;
