const sortNamesAlphabetically = (array) => {
  const sortingArray = [...array];
  return sortingArray.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

export default sortNamesAlphabetically;
