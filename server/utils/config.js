const mongoose = require('mongoose');

const initializeMongoDB = async (app) => {
  await mongoose.connect(
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGO_URI
      : process.env.MONGO_URI
  );

  return true;
};

module.exports = initializeMongoDB;
