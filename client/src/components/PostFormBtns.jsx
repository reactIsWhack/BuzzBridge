import React from 'react';

const PostFormBtns = ({ postMessage }) => {
  return (
    <>
      <div className="post-btn-container">
        <button
          className={`post-btn ${!postMessage && 'post-btn-disabled'}`}
          disabled={!postMessage ? true : false}
        >
          Post
        </button>
      </div>
    </>
  );
};

export default PostFormBtns;
