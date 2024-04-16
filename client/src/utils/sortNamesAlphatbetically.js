const sortNamesAlphabetically = (array) => {
  const sortingArray = [...array];
  return sortingArray.sort((a, b) => {
    const aName = a.firstName + ' ' + a.lastName;
    const bName = b.firstName + ' ' + b.lastName;
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
};

export default sortNamesAlphabetically;
