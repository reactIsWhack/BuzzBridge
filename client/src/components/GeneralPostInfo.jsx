import React from 'react';
import renderExactDate from '../utils/renderExactDate';

const currentYear = new Date().getFullYear().toString();

const GeneralPostInfo = ({ author, createdAt }) => {
  const postCreatedAtDate = new Date(createdAt);
  const { month, formattedDay, year, at, time, daytime, dayName } =
    renderExactDate(postCreatedAtDate);

  return (
    <div className="author-info">
      <img src={author.photo} className="author-post-profile" />
      <div>
        <div className="post-author-name">
          {author.firstName + ' ' + author.lastName}
        </div>
        <span>{`${month} ${formattedDay}${
          currentYear !== year ? year : ''
        } at ${time} ${daytime}`}</span>
      </div>
    </div>
  );
};

export default GeneralPostInfo;
