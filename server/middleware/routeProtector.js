const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(verified.id);

  if (!user) {
    res.status(401);
    throw new Error('User not registered, please create an account');
  }

  // If the jwt secret or payload has not been tampered with, allow the user to use the api route and attach their id to the request.
  // Their id will be used to query for their document in the DB and populate their fields.

  if (verified && user) {
    req.userId = user._id;
    return next();
  } else {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
});

module.exports = protect;
