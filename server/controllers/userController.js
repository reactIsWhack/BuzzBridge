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
  // testingUser for this controller sends a registered user a friendRequest every time they create an account (for testing)
  const testingUser = await User.findOne({ email: 'packer.slacker@gmail.com' });

  if (!confirmPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // Create the user and add the testingUser id to the friendRequests
  const user = await User.create({
    name,
    email,
    password,
    friendRequests: [testingUser._id],
  });
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
      friendRequests: user.friendRequests,
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

    const { name, bio, friends, friendRequests, _id, photo } = user;

    res.status(200).json({
      name,
      email: user.email,
      bio,
      friends,
      friendRequests,
      _id,
      photo,
    });
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
  const { friendId } = req.params;

  // get friendId from the params and find the requestedUser, if it is not found throw a 404 error

  const requestedUser = await User.findById(friendId);

  if (!requestedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // Now add the id of the user making the friendRequest to the requested users friendRequests array.
  // This id will come from the req.userId property attatched in the authMiddleware which protects the routes.

  requestedUser.friendRequests = [...requestedUser.friendRequests, req.userId];

  // The friendRequests array of a user represents all of the userId's that have requested to be a friend of this user. It will be populated during GET requests

  const updatedRequestedUser = await requestedUser.save();

  if (updatedRequestedUser) {
    res.status(200).json({ message: 'Friend Request Sent!' });
  }
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const requestedUser = await User.findById(userId);

  // makes sure the accepted user exists

  if (!requestedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // user variable is the user logged in / person accepting the request.
  // The req.userId comes from the auth middleware which attaches the logged in usersId if they are logged in using jwt.

  const user = await User.findById(req.userId);

  // find the user, and remove the requested userId from the requestedUser friendRequests array

  user.friendRequests = requestedUser.friendRequests.filter(
    (friendRequest) => String(friendRequest) !== String(userId)
  );

  // Add the logged in usersId (user that accepted the request) to the requestedUsers friends and the logged in usersFriends

  requestedUser.friends = [...requestedUser.friends, user._id];
  user.friends = [...user.friends, requestedUser._id];

  // Save both the accepted user, and the user that accepted the request

  await requestedUser.save();
  const updatedUser = await user.save();

  if (updatedUser) {
    const { name, email, bio, friends, friendRequests, photo, _id } =
      updatedUser;
    res
      .status(200)
      .json({ name, email, bio, friends, friendRequests, photo, _id });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
  acceptFriendRequest,
};
