const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/userRoute');
const {
  authErrorHandler,
  postErrorHandler,
} = require('./middleware/errorHandler');
const postRouter = require('./routes/postRoute');
const commentRouter = require('./routes/commentRoute');
const { initializeMongoDB } = require('./utils/config');

const app = express();
const PORT = 5000;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes Middleware

app.use('/api/users', userRouter, authErrorHandler);
app.use('/api/posts', postRouter, postErrorHandler);
app.use('/api/comments', commentRouter, postErrorHandler);

// Connect to MongoDB

const connectedSuccessfully = initializeMongoDB();

if (connectedSuccessfully) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
}
