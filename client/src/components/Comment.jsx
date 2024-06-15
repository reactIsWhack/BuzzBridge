import { useState } from 'react';
import '../styles/Comment.css';
import CommentLikesDesc from './CommentLikesDesc';
import ExpandedUsersLikedList from './ExpandedUsersLikedList';
import HoverInfo from './HoverInfo';
import ContentControls from './ContentControls';
import CommentActions from './CommentActions';

const Comment = ({ commentMessage, author, likes, createdAt, _id, postId }) => {
  const [renderLikesList, setRenderLikesList] = useState(false); // determines if a list of users that liked a comment should be rendered.

  const [likedListMounted, setLikedListMounted] = useState(false);
  const [renderCommentControls, setRenderCommentControls] = useState(false);
  const [renderPostOptions, setRenderPostOptions] = useState(false); // Determines if a menu to delete or edit a comment should be shown
  const [renderThreeDots, setRenderThreeDots] = useState(false);

  const handleMouseOver = (e) => {
    if (!likedListMounted && !renderLikesList) {
      setRenderLikesList(true);
      setLikedListMounted(true);
    }
  }; // These functions toggle the rendering of the users liked list when the like icon of a comment is hovered.
  const handleMouseLeave = async (e) => {
    setLikedListMounted(false);
  };

  const renderCommentMenu = () => {
    setRenderCommentControls(true);
    setRenderThreeDots(true);
  };
  const hideCommentMenu = () => {
    if (!renderPostOptions) {
      setRenderCommentControls(false);
    }
    setRenderThreeDots(false);
  };

  return (
    <div
      className="comment"
      onMouseOver={renderCommentMenu}
      onMouseLeave={hideCommentMenu}
    >
      <div className="comment-top">
        <img src={author.photo} />
        <div className="main-comment-content">
          <div className="comment-content">
            <span>{author.firstName + ' ' + author.lastName}</span>
            <div className="comment-message">{commentMessage}</div>
            {likes.total > 0 && (
              <div
                className="comments-like-section"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              >
                <CommentLikesDesc likes={likes} />
                {/* renders an icon that displays the number of likes for a comment */}
                {renderLikesList && (
                  <HoverInfo
                    setRenderHoverWindow={setRenderLikesList}
                    className="expanded-users-liked-list"
                    isMounted={likedListMounted}
                  >
                    <ExpandedUsersLikedList userList={likes.usersLiked} />
                  </HoverInfo>
                )}
                {/* when the icon is hovered, this component renders a list of users that liked that comment */}
              </div>
            )}
          </div>
          {renderCommentControls && (
            <ContentControls
              renderPostOptions={renderPostOptions}
              setRenderPostOptions={setRenderPostOptions}
              author={author}
              _id={_id}
              className="comment-options"
              renderThreeDots={renderThreeDots}
              postId={postId}
            />
          )}
        </div>
      </div>
      <CommentActions
        createdAt={createdAt}
        _id={_id}
        postId={postId}
        usersLiked={likes.usersLiked}
      />
    </div>
  );
};

export default Comment;
