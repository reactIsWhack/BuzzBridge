const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const generateToken = (id) => {
  // Generates a json web token using the id of the registered or logged in user

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!confirmPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  // sends jwt as a cookie to the browser, using generated token
  if (user) {
    res.cookie('token', token, {
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    res.status(201).json({
      name: user.name,
      email: user.email,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const user = await User.findOne({ email });

  // Check if the user is registered

  if (!user) {
    res.status(400);
    throw new Error('User not registered, please login');
  }

  // Check if password is correct

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // If the password is correct and the user is registered, then send cookies to the browser and return the users data

  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    res.cookie('token', token, {
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    const { name, bio, friends, friendRequests, _id } = user;

    res
      .status(200)
      .json({ name, email: user.email, bio, friends, friendRequests, _id });
  } else {
    res.status(400);
    throw new Error('Invalid email or password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'none',
    secure: true,
    httpOnly: true,
  });

  res.status(200).json({ message: 'Logged Out Successfully' });
});

const getLoginStatus = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

const friendRequest = asyncHandler(async (req, res) => {
  res.send('Friend Request');
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
};
