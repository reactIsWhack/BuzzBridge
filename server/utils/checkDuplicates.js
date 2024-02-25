function arrayHasDuplicates(array) {
  const uniqueValues = new Set();

  array.forEach((item) => uniqueValues.add(String(item)));

  if (uniqueValues.size < array.length) {
    return true;
  }

  return false;
}

module.exports = arrayHasDuplicates;
