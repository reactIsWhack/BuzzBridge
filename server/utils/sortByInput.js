const sortByInput = (array, sortingMethod) => {
  return array.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortingMethod === 'latest' ? dateB - dateA : dateA - dateB;
  });
};

module.exports = sortByInput;
