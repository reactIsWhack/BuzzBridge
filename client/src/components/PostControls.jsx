import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { SlOptions } from 'react-icons/sl';
import PostOptions from './PostOptions';
import { setDeletedPostId } from '../app/features/posts/postsSlice';
import useClickOutside from '../hooks/useClickOutside';

const PostControls = ({ author, _id }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser); // Gets the id of the user to check if the given post is from the logged in user

  const menuRef = useRef(null); // The three dots to toggle the post menu
  const optionsRef = useRef(null); // The whole container of the post menu
  const [renderPostOptions, setRenderPostOptions] = useState(false); // Determines if a menu to delete or edit a post should be shown

  useClickOutside({ parentRef: menuRef, childRef: optionsRef }, () =>
    setRenderPostOptions(false)
  ); // This hook controls the rendering of the menu. If the user clicks on the outside page while the menu is open, the menu closes.
  // But, if the user clicks on the three dots (considered the outside page by default), then this hook ensures the menu will not close.

  const handleClick = () => {
    if (!renderPostOptions) {
      setRenderPostOptions(true);
      // Each time a user chooses to delete a post in the post menu, set the id of the post intended to be deleted.
      dispatch(setDeletedPostId(_id));
    }
  };

  return (
    <div className="post-options" onClick={handleClick} ref={menuRef}>
      {String(userId) === String(author._id) && (
        <SlOptions fill="#606770" size={18} cursor="pointer" /> // Render three dots to toggle the post menu if the given post is from the logged in user
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
  );
};

export default PostControls;
