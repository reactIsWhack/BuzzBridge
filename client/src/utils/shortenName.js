const shortenName = (firstName, lastName) => {
  const fullName = firstName + ' ' + lastName;
  if (fullName.length > 16 && window.screen.width < 1000) {
    if (firstName.length < 16) {
      const shortenedName =
        firstName +
        ' ' +
        lastName.slice(0, 13 - (firstName.length + 1)) +
        '...';
      return shortenedName;
    } else {
      return firstName.slice(0, 13) + '...';
    }
  }

  if (window.screen.width > 1000 && fullName.length > 20) {
    if (firstName.length < 20) {
      const shortenedName =
        firstName +
        ' ' +
        lastName.slice(0, 17 - (firstName.length + 1)) +
        '...';
      return shortenedName;
    } else {
      return firstName.slice(0, 17) + '...';
    }
  }

  return firstName + ' ' + lastName;
};

export default shortenName;
