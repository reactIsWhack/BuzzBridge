import React from 'react';
import renderExactDate from '../utils/renderExactDate';

const FullDateCreation = ({ createdAt }) => {
  const { month, formattedDay, year, at, time, daytime, dayName } =
    renderExactDate(new Date(createdAt));

  return (
    <div>
      {`${dayName}, ${month} ${formattedDay}, ${year} at ${time} ${daytime}`}
    </div>
  );
};

export default FullDateCreation;
