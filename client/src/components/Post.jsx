import React, { useRef } from 'react';
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
    <div className="post-card" id={_id}>
      <div className="post-top-container">
        <div className="author-section">
          <div className="author-info">
            <img src={author.photo} className="author-post-profile" />
            <div>
              <div>{author.firstName + ' ' + author.lastName}</div>
              <span>{`${month} ${formattedDay}${formattedYear} at ${time} ${daytime}`}</span>
            </div>
          </div>
          {String(userId) === String(_id) && <SlOptions />}
        </div>
        <div className="post-message">{postMessage}</div>
      </div>
      {img.src &&
        (img.fileType === 'video/mp4' ? (
          <video controls width="100%" className="post-img">
            <source src={img.src} type="video/mp4" />
          </video>
        ) : (
          <img src={img.src} className="post-img" />
        ))}
      <div className="post-bottom-container">
        <div className="post-actions"></div>
      </div>
    </div>
  );
};

export default Post;
