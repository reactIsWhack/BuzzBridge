const renderExactDate = (date) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Puts the createdAt in formatted eastern time as an array
  const formattedDateTime = date
    .toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
    .split(' ');
  const dayName = days[date.getDay()];

  const [month, day, year, at, time, daytime] = formattedDateTime;
  // Removes the comma after day
  const formattedDay = day.slice(0, day.indexOf(','));

  return { month, formattedDay, year, at, time, daytime, dayName };
};

export default renderExactDate;
