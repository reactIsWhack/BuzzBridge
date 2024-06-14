import React from 'react';

const PostFormBtns = ({ postMessage, editing }) => {
  return (
    <>
      <div className="post-btn-container">
        <button
          className={`post-btn ${!postMessage && 'post-btn-disabled'}`}
          disabled={!postMessage ? true : false}
        >
          {editing ? 'Save' : 'Post'}
        </button>
      </div>
    </>
  );
};

export default PostFormBtns;
