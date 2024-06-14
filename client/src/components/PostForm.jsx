import React, { useState, useEffect, useRef } from 'react';
import '../styles/PostForm.css';
import closeIcon from '../assets/closeIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import imageIcon from '../assets/imageIcon.svg';
import { createPost } from '../app/features/posts/postsSlice';
import useDisableBackground from '../hooks/useDisableBackground';
import createNewLine from '../utils/createNewLine';
import { setRenderPostFormModal } from '../app/features/popup/popupSlice';
import PostFormBtns from './PostFormBtns';

const PostForm = ({ renderModal }) => {
  const { firstName, lastName, profilePicture } = useSelector(selectUser);
  const { editing, render, editedPost } = renderModal;
  const [imagePreview, setImagePreview] = useState(
    editing ? editedPost.img.src : ''
  );
  const [postMessage, setPostMessage] = useState(
    editing ? editedPost.postMessage : ''
  );
  const [enterTotal, setEnterTotal] = useState(0);
  const fileUploadRef = useRef(null);
  const dispatch = useDispatch();

  const previewFile = async (e) => {
    if (!postMessage) {
      document
        .getElementById('post-form-textarea')
        .style.removeProperty('height');
    }

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
    await dispatch(createPost(formData));
    dispatch(setRenderPostFormModal({ render: false, editing: false }));
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
    // allows new lines to be created when enter key is pressed
    createNewLine(
      postMessage.length > 630 || imagePreview ? true : false,
      e.target
    );
  };

  const clearFileUpload = () => {
    setImagePreview('');
    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }
    if (postMessage.length < 630) {
      document
        .getElementById('post-form-textarea')
        .style.removeProperty('height');
    }
  };

  useDisableBackground(renderModal, 'postModal');

  useEffect(() => {
    if (!postMessage) {
      const textArea = document.getElementById('post-form-textarea');
      textArea.rows = !imagePreview ? 7 : 2;
      textArea.style.removeProperty('height');
      setEnterTotal(0);
    }
  }, [postMessage, imagePreview]);

  return (
    <div className="post-modal-container">
      <div className="modal-top">
        <div className="modal-close-icon">
          <img
            src={closeIcon}
            onClick={() =>
              dispatch(
                setRenderPostFormModal({ render: false, editing: false })
              )
            }
          />
        </div>
        <h2>{editing ? 'Edit' : 'Create'} Post</h2>
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
            id="post-form-textarea"
          ></textarea>
          {imagePreview ? (
            <div className="image-preview-container">
              <img
                src={closeIcon}
                className="close-icon"
                onClick={clearFileUpload}
              />
              <img src={imagePreview} className="file-upload-preview" />
            </div>
          ) : (
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
          <PostFormBtns postMessage={postMessage} editing={editing} />{' '}
          {/* contains the creation or edit button for a post depending on if the user is editing or creating a post*/}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
