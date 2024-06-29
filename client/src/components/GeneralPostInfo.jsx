import { useState } from 'react';
import renderExactDate from '../utils/renderExactDate';
import HoverInfo from './HoverInfo';
import FullDateCreation from './FullDateCreation';
import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear().toString();

const GeneralPostInfo = ({ author, createdAt }) => {
  const navigate = useNavigate();
  const postCreatedAtDate = new Date(createdAt);
  const { month, formattedDay, year, at, time, daytime, dayName } =
    renderExactDate(postCreatedAtDate);
  const [renderFullPostDate, setRenderFullPostDate] = useState(false); // renders the exact date a post was created when the timestamp is hovered over
  const [fullPostDateMounted, setFullPostDateMounted] = useState(false);
  // smoothly renders the exact date of a posts creation when the component mounts and unmounts

  const handleMouseOver = () => {
    if (!fullPostDateMounted && !renderFullPostDate) {
      setTimeout(() => {
        setRenderFullPostDate(true);
        setFullPostDateMounted(true);
      }, 1000);
    }
  };
  const handleMouseLeave = () => setFullPostDateMounted(false);
  const navigateToProfile = () => navigate(`/userprofile/${author._id}`);

  return (
    <div className="author-info">
      <img src={author.photo} className="author-post-profile" />
      <div>
        <div className="post-author-name" onClick={navigateToProfile}>
          {author.firstName + ' ' + author.lastName}
        </div>
        <div
          className="post-timestamp-container"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          <span>{`${month} ${formattedDay}${
            currentYear !== year ? `, ${year}` : ''
          } at ${time} ${daytime}`}</span>
          {renderFullPostDate && (
            <HoverInfo
              isMounted={fullPostDateMounted}
              setRenderHoverWindow={setRenderFullPostDate}
              className="post-full-date"
            >
              <FullDateCreation createdAt={createdAt} />
            </HoverInfo>
          )}{' '}
          {/* HoverInfo is a  component that has the smooth transition of a div when conditionally rendered */}
        </div>
      </div>
    </div>
  );
};

export default GeneralPostInfo;
