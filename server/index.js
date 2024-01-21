const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes Middleware

// Error Handler

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
