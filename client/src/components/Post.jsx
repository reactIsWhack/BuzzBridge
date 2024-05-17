import React, { useRef, useState } from 'react';
import '../styles/Post.css';
import { SlOptions } from 'react-icons/sl';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import PostOptions from './PostOptions';
import useClickOutside from '../hooks/useClickOutside';
import { setDeletedPostId } from '../app/features/posts/postsSlice';
import { PostActions } from './PostActions';

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
  const [renderPostOptions, setRenderPostOptions] = useState(false);
  const menuRef = useRef(null);
  const optionsRef = useRef(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!renderPostOptions) {
      setRenderPostOptions(true);
      // Each time a user chooses to delete a post in the post menu, set the id of the post intended to be deleted.
      dispatch(setDeletedPostId(_id));
    }
  };

  useClickOutside({ parentRef: menuRef, childRef: optionsRef }, () =>
    setRenderPostOptions(false)
  );

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
          <div className="post-options" onClick={handleClick} ref={menuRef}>
            {String(userId) === String(author._id) && (
              <SlOptions fill="#606770" size={18} cursor="pointer" />
            )}
            {renderPostOptions && (
              <div ref={optionsRef} className="post-options-container">
                <PostOptions
                  setRenderPostOptions={setRenderPostOptions}
                  renderPostOptions={renderPostOptions}
                />
              </div>
            )}
          </div>
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
        <div className="post-actions-container">
          <PostActions likes={likes} id={_id} />
        </div>
      </div>
    </div>
  );
};

export default Post;
