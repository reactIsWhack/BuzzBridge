const createNewLine = (shouldCreate, element) => {
  if (shouldCreate) {
    element.style.height = element.style.minHeight = 'auto';
    element.style.minHeight = `${Math.min(
      element.scrollHeight + 4,
      parseInt(element.style.maxHeight)
    )}px`;
    element.style.height = `${element.scrollHeight + 4}px`;
  }
};

export default createNewLine;
