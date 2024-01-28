const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const generateFakeUsers = require('./utils/seeds');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/userRoute');
const {
  authErrorHandler,
  postErrorHandler,
} = require('./middleware/errorHandler');
const postRouter = require('./routes/postRoute');

const app = express();
const PORT = 5000;

generateFakeUsers();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes Middleware

app.use('/api/users', userRouter, authErrorHandler);
app.use('/api/posts', postRouter, postErrorHandler);

// Connect to MongoDB

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    throw new Error(error);
  }
};

connectDB();
