import React from 'react';
import '../styles/Post.css';
import { SlOptions } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const currentYear = new Date().getFullYear().toString();

const Post = ({
  author,
  postMessage,
  likes,
  comments,
  img,
  createdAt,
  _id,
}) => {
  const postCreatedAtDate = new Date(createdAt);
  // Puts the createdAt in formatted eastern time as an array
  const formattedDateTime = postCreatedAtDate
    .toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
    .split(' ');
  const [month, day, year, at, time, daytime] = formattedDateTime;
  // Removes the comma after day
  const formattedDay = day.slice(0, day.indexOf(','));
  const formattedYear = currentYear !== year ? `, ${year}` : '';
  const { userId } = useSelector(selectUser);

  return (
    <div className="post-card">
      <div className="post-top-container">
        <div className="author-section">
          <div className="author-info">
            <img src={author.photo} className="author-post-profile" />
            <div>
              <div>{author.name}</div>
              <span>{`${month} ${formattedDay}${formattedYear} at ${time} ${daytime}`}</span>
            </div>
          </div>
          {String(userId) === String(_id) && <SlOptions />}
        </div>
        <div className="post-message">{postMessage}</div>
      </div>
      {img && <img src={img} className="post-img" />}
    </div>
  );
};

export default Post;
