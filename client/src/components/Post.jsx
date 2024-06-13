import React, { useState, useEffect } from 'react';
import '../styles/Post.css';
import { PostActions } from './PostActions';
import UsersLikedList from './UsersLikedList';
import CommentBar from './CommentBar';
import Comment from './Comment';
import GeneralPostInfo from './GeneralPostInfo';
import ContentControls from './ContentControls';

const Post = ({
  author,
  postMessage,
  likes,
  comments,
  img,
  createdAt,
  _id,
}) => {
  const [renderComments, setRenderComments] = useState(true); // allows the user to collapse or show all comments

  // When the page first loads, only render the latest comment
  const [renderOnlyLatestComments, setRenderOnlyLatestComments] =
    useState(true);
  const [latestComments, setLatestComments] = useState([]); // Renders the latest comment when the component mounts and any new comments that are created
  const [renderPostOptions, setRenderPostOptions] = useState(false); // Determines if a menu to delete or edit a post should be shown

  // State is used to render the number of previous comments and if comments should be rendered. Number of previous comments refers to all the comments except for the latest one.
  const [originalCommentLength, setOriginalCommentLength] = useState(0);
  const previousCommentsLength = originalCommentLength - 1;

  useEffect(() => {
    // Sets the length of the comments of a post when the page first loads. Used to keep track of the number of previous posts.
    setOriginalCommentLength(comments.length);
  }, []);

  useEffect(() => {
    setLatestComments(comments.slice(originalCommentLength - 1));
  }, [comments]); // When new comments are added, update the latest comments to render the new comments.

  const commentsToBeRendered =
    renderOnlyLatestComments && originalCommentLength !== 0
      ? latestComments // if the user only wants to view the LATEST comments
      : comments; // if the user wants to view ALL the comments

  const commentCards = commentsToBeRendered.map((comment) => {
    return <Comment key={comment._id} {...comment} postId={_id} />;
  });

  const togglePreviousCommentsRender = () => setRenderOnlyLatestComments(false);

  const toggleRenderComments = () => setRenderComments((prev) => !prev); // toggles between collapsing and rendering all comments

  return (
    <div className="post-card" id={_id}>
      <div className="post-top-container">
        <div className="author-section">
          <GeneralPostInfo author={author} createdAt={createdAt} />
          <ContentControls
            author={author}
            _id={_id}
            className="post-options"
            renderPostOptions={renderPostOptions}
            setRenderPostOptions={setRenderPostOptions}
          />
        </div>
        <div className="post-message">{postMessage}</div>
      </div>
      <div className="post-content">
        {img.src &&
          (img.fileType === 'video/mp4' ? (
            <video controls width="100%" className="post-img">
              <source src={img.src} type="video/mp4" />
            </video>
          ) : (
            <img src={img.src} className="post-img" />
          ))}
      </div>
      <div className="post-labels-container">
        <div>{likes.total > 0 && <UsersLikedList likes={likes} />}</div>{' '}
        {/* renders a list of users that liked a post (3 maximum) */}
        {comments.length > 0 && ( // renders the number of comments for a post, and jsx is used to collapse or open all comments
          <div
            className="post-comments-label"
            onClick={toggleRenderComments}
          >{`${comments.length} ${
            comments.length === 1 ? 'Comment' : 'Comments'
          }`}</div>
        )}
      </div>
      <div
        className={`post-bottom-container ${
          !renderComments && 'bottom-no-padding' // removes padding from the bottom of post if comments are collapsed
        }`}
      >
        <div className="post-actions-container">
          <PostActions likes={likes} id={_id} />
          {/* contains the like and comment buttons for a post */}
        </div>
        {renderComments && <div className="bottom-post-border"></div>}
        {/* border between the comments and the rest of a post */}

        {comments.length > 0 && renderComments && (
          <div className="comments-container">
            {renderOnlyLatestComments && originalCommentLength > 1 && (
              <div
                className="view-previous"
                onClick={togglePreviousCommentsRender}
              >{`View ${previousCommentsLength} previous ${
                previousCommentsLength === 1 ? 'comment' : 'comments'
              }`}</div>
            )}
            {/* Displays the number of old comments for a post (all the comments except for the latest one). When the text is clicked, these old comments will be rendered */}
            {commentCards}
          </div>
        )}
        {renderComments && <CommentBar id={_id} />}
      </div>
    </div>
  );
};

export default Post;
