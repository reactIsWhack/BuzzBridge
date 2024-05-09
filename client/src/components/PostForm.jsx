import React, { useState, useEffect, useRef } from 'react';
import '../styles/PostForm.css';
import closeIcon from '../assets/closeIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import imageIcon from '../assets/imageIcon.svg';
import { createPost } from '../app/features/posts/postsSlice';

const PostForm = ({ setRenderModal, renderModal }) => {
  const { firstName, lastName, profilePicture } = useSelector(selectUser);
  const [imagePreview, setImagePreview] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [enterTotal, setEnterTotal] = useState(0);
  const fileUploadRef = useRef(null);
  const dispatch = useDispatch();

  const previewFile = async (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };
  let requestCount = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    requestCount++;
    if (requestCount > 1) {
      return;
    }
    const formData = new FormData();

    const photo = fileUploadRef.current && fileUploadRef.current.files[0];
    formData.append('photo', photo);
    formData.append('postMessage', postMessage);
    console.log(formData.get('postMessage'), formData.get('photo'));
    await dispatch(createPost(formData));
    setRenderModal(false);
  };

  const handleOnKeyDown = async (e) => {
    if (e.key === 'Backspace') {
      const selectionStart = e.target.selectionStart;
      const text = e.target.value;
      const previousChar = text[selectionStart - 1];
      if (previousChar === '\n') {
        setEnterTotal((prev) => prev - 1);

        if ((selectionStart > 7 && e.target.rows > 7) || imagePreview) {
          e.target.rows--;
        }
      }
    }

    if (e.key === 'Enter') {
      setEnterTotal((prev) => prev + 1);

      if (enterTotal >= 7 || imagePreview) {
        e.target.rows++;
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setPostMessage(value);
  };

  const handleClick = (e) => {
    e.target.value = null;
  };

  const handleInput = (e) => {
    if (postMessage.length > 630 || imagePreview) {
      e.target.style.height = e.target.style.minHeight = 'auto';
      e.target.style.minHeight = `${Math.min(
        e.target.scrollHeight + 4,
        parseInt(e.target.style.maxHeight)
      )}px`;
      e.target.style.height = `${e.target.scrollHeight + 4}px`;
    }
  };

  const clearFileUpload = () => {
    setImagePreview('');
    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }
  };

  useEffect(() => {
    if (renderModal) {
      document.body.classList.add('body-disabled-scroll');
      document.querySelector('.home').classList.add('home-backdrop');
      document
        .querySelector('.main-page')
        .append(document.querySelector('.post-modal'));
    }

    return () => {
      document.body.classList.remove('body-disabled-scroll');
      document.querySelector('.home').classList.remove('home-backdrop');
    };
  }, []);

  return (
    <div className="post-modal-container">
      <div className="post-modal-top">
        <div className="post-close-icon">
          <img src={closeIcon} onClick={() => setRenderModal(false)} />
        </div>
        <h2>Create Post</h2>
      </div>
      <div className="modal-border"></div>
      <div className="post-form-section">
        <div className="post-author-information">
          <img src={profilePicture} className="post-form-photo" />
          <div>
            <div>posting as</div>
            <span>{firstName + ' ' + lastName}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder={`What's on your mind, ${
              firstName[0].toUpperCase() + firstName.slice(1)
            }?`}
            name="postMessage"
            maxLength={1500}
            onKeyDown={handleOnKeyDown}
            onChange={handleChange}
            rows={imagePreview ? 0 : 7}
            value={postMessage}
            onInput={handleInput}
          ></textarea>
          {imagePreview && (
            <div className="image-preview-container">
              <img
                src={closeIcon}
                className="close-icon"
                onClick={clearFileUpload}
              />
              <img src={imagePreview} className="file-upload-preview" />
            </div>
          )}
          {!imagePreview && (
            <label htmlFor="file-upload" className="custom-file-upload">
              <img src={imageIcon} />
              <div>Add a photo or video to your post</div>
            </label>
          )}
          <input
            id="file-upload"
            type="file"
            name="postImage"
            onChange={previewFile}
            onClick={handleClick}
            ref={fileUploadRef}
          />
          <div className="post-btn-container">
            <button
              className={`post-btn ${!postMessage && 'post-btn-disabled'}`}
              disabled={!postMessage ? true : false}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
