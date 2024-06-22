import { useState } from 'react';
import renderExactDate from '../utils/renderExactDate';
import HoverInfo from './HoverInfo';
import FullDateCreation from './FullDateCreation';

const currentYear = new Date().getFullYear().toString();

const GeneralPostInfo = ({ author, createdAt }) => {
  const postCreatedAtDate = new Date(createdAt);
  const { month, formattedDay, year, at, time, daytime, dayName } =
    renderExactDate(postCreatedAtDate);
  const [renderFullPostDate, setRenderFullPostDate] = useState(false); // renders the exact date a post was created when the timestamp is hovered over
  const [fullPostDateMounted, setFullPostDateMounted] = useState(false);
  // smoothly renders the exact date of a posts creation when the component mounts and unmounts

  const handleMouseOver = () => {
    if (!fullPostDateMounted && !renderFullPostDate) {
      setRenderFullPostDate(true);
      setFullPostDateMounted(true);
    }
  };
  const handleMouseLeave = () => setFullPostDateMounted(false);

  return (
    <div className="author-info">
      <img src={author.photo} className="author-post-profile" />
      <div>
        <div className="post-author-name">
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
