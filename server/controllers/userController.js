const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const User = require('../models/userModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const generateToken = (id, isTesting) => {
  // Generates a json web token using the id of the registered or logged in user
  const time = isTesting ? '-10s' : '1d';
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: time,
  });
  return token;
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  const token = generateToken(user._id);

  // sends jwt as a cookie to the browser, using generated token
  if (user) {
    res.cookie('token', token, {
      path: '/',
      sameSite: 'none',
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    });

    res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, isTesting } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const user = await User.findOne({ email }).populate([
    {
      path: 'friends',
      model: 'user',
      select: ['-password'],
      populate: [
        {
          path: 'friends',
          model: 'user',
          select: '-password',
        },
        {
          path: 'posts',
          model: 'post',
          populate: { path: 'author', model: 'user', select: '-password' },
          options: { limit: 10 },
        },
      ],
    },
    {
      path: 'friendRequests',
      model: 'user',
      select: ['-password'],
    },
  ]);

  // Check if the user is registered

  if (!user) {
    res.status(400);
    throw new Error('User not registered, please login');
  }

  // Check if password is correct

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // If the password is correct and the user is registered, then send cookies to the browser and return the users data

  if (user && passwordIsCorrect) {
    const token = generateToken(user._id, isTesting);

    res.cookie('token', token, {
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    const {
      firstName,
      lastName,
      bio,
      friends,
      friendRequests,
      _id,
      photo,
      posts,
      createdAt,
    } = user;

    res.status(200).json({
      firstName,
      lastName,
      email: user.email,
      bio,
      friends,
      friendRequests,
      _id,
      photo,
      posts,
      createdAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid password');
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
  console.log(verified);

  // Ensure the user is registered
  const user = await User.findById(verified.id);

  if (verified && user) {
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

  const requestedUser = await User.findById(userId).populate({
    path: 'friends',
    model: 'user',
    populate: { path: 'friends', model: 'user' },
  });

  // makes sure the accepted user exists

  if (!requestedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // user variable is the user logged in / person accepting the request.
  // The req.userId comes from the auth middleware which attaches the logged in usersId if they are logged in using jwt.

  const user = await User.findById(req.userId).populate({
    path: 'friends',
    model: 'user',
    populate: { path: 'friends', model: 'user' },
  });

  // find the user, and remove the requested userId from the requestedUser friendRequests array

  const updatedFriendRequests = user.friendRequests.filter(
    (friendRequest) => String(friendRequest._id) !== String(requestedUser._id)
  );
  user.friendRequests = updatedFriendRequests;

  // Add the logged in usersId (user that accepted the request) to the requestedUsers friends and the logged in usersFriends

  requestedUser.friends = [...requestedUser.friends, user._id];
  user.friends = [...user.friends, requestedUser._id];

  // Save both the accepted user, and the user that accepted the request

  await requestedUser.save().then((user) =>
    user.populate({
      path: 'friends',
      model: 'user',
      populate: { path: 'friends', model: 'user' },
    })
  );
  const updatedUser = await user.save().then((user) =>
    user.populate([
      {
        path: 'friends',
        model: 'user',
        select: ['-password'],
        populate: { path: 'friends', model: 'user' },
      },
      {
        path: 'friendRequests',
        model: 'user',
        select: ['-password'],
      },
    ])
  );
  res.json(updatedUser);
});

const getLoggedInUser = asyncHandler(async (req, res) => {
  const { skip } = req.params;
  const user = await User.findById(req.userId)
    .populate([
      {
        path: 'posts',
        model: 'post',
        options: {
          skip,
          limit: 5,
        },
        populate: {
          path: 'author',
          model: 'user',
          select: ['-password'],
        },
      },
      { path: 'friendRequests', model: 'user', select: '-password' },
      { path: 'friends', model: 'user', select: '-password' },
    ])
    .select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const loggedInUser = await User.findById(req.userId);
  // Finds all users (max of 15) that the loggedInUser is not friends with, discluding themselves
  const users = await User.find({
    _id: { $nin: [...loggedInUser.friends, loggedInUser._id] },
  })
    .skip(req.params.skip)
    .limit(15);

  if (!users) {
    throw new Error('Failed to get users');
  }

  // Passwords cannot be viewed on the client

  res.status(200).json(
    users.map((user) => {
      user.password = null;
      return user;
    })
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId, skip } = req.params;

  const user = await User.findById(userId)
    .select('-password')
    .populate([
      { path: 'friends', select: '-password' },
      {
        path: 'posts',
        options: {
          skip,
          limit: 5,
        },
        populate: {
          path: 'author',
          model: 'user',
          select: '-password',
        },
      },
    ]);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { bio, currentPassword, newPassword, confirmPassword, photoType } =
    req.body;
  // photoType specifies if the user is updating their profile picture or cover photo when attatching a file to the request.
  const user = await User.findById(req.userId);

  // First check if the user is updating their avatar, and if so update the avatar and return

  if (req.file) {
    let avatar = '';
    try {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'NodeNet',
      });
      avatar = secure_url;
    } catch (error) {}

    photoType === 'coverPhoto'
      ? (user.coverPhoto = avatar)
      : (user.photo = avatar);
    const updatedUser = await user.save();
    const {
      firstName,
      lastName,
      email,
      bio,
      friends,
      friendRequests,
      _id,
      photo,
      createdAt,
      updatedAt,
      coverPhoto,
    } = updatedUser;

    return res.status(200).json({
      firstName,
      lastName,
      email,
      bio,
      friends,
      friendRequests,
      photo,
      coverPhoto,
      _id,
      createdAt,
      updatedAt,
    });
  }

  if (currentPassword && confirmPassword && newPassword) {
    const currentPasswordIsCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    // Check if the current password is correct

    if (!currentPasswordIsCorrect) {
      res.status(400);
      throw new Error('Current password is not correct');
    }

    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    user.password = newPassword;

    await user.save();
    return res.status(200).json({ message: 'Password Updated!' });
  }

  user.bio = bio;

  const updatedUser = await user.save();
  res.status(200).json({ bio: updatedUser.bio });
});

const removeFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  // Remove the friend id from the logged in user's array and the remove the logged in user's id from t he user being unfriended

  const friend = await User.findById(friendId);
  const loggedInUser = await User.findById(req.userId);

  if (!friend) {
    res.status(404);
    throw new Error('Friend not found');
  }

  friend.friends = friend.friends.filter(
    (userId) => String(userId) !== String(req.userId)
  );
  loggedInUser.friends = loggedInUser.friends.filter(
    (userId) => String(userId) !== String(friendId)
  );

  await friend.save();
  const { friends, mutualFriends } = await loggedInUser.save().then((post) =>
    post.populate([
      { path: 'friends', model: 'user', select: ['-password', '-posts'] },
      {
        path: 'friendRequests',
        model: 'user',
        select: ['-password', '-posts'],
      },
    ])
  );

  res.status(200).json({ friends, mutualFriends });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
  acceptFriendRequest,
  getLoggedInUser,
  getAllUsers,
  getUserProfile,
  updateUser,
  removeFriend,
};
