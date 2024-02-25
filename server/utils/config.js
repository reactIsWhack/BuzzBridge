const mongoose = require('mongoose');
require('dotenv').config();

const initializeMongoDB = async () => {
  await mongoose.connect(
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGO_URI
      : process.env.MONGO_URI
  );

  return true;
};

const disconnectMongoDB = async () => await mongoose.connection.close();

module.exports = { initializeMongoDB, disconnectMongoDB };
