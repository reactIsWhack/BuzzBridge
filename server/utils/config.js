const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

// intializeMongoDB is used for testing

let mongoServer;

const initializeMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    dbName: process.env.NODE_ENV === 'test' ? 'NodeNetTest' : 'NodeNet',
  });

  console.log(`MongoDB successfully connected to ${mongoUri}`);
};

const disconnectMongoDB = async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
};

// connectMongoDBClient is used in production

const connectMongoDBClient = async () => {
  await mongoose.connect(process.env.NODE_ENV);

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};

module.exports = { initializeMongoDB, disconnectMongoDB, connectMongoDBClient };
