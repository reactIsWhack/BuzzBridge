const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/postModel');
const User = require('../models/userModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const createPost = asyncHandler(async (req, res) => {
  const { postMessage } = req.body;
  let postImg = '';

  // If the user adds a photo to the post, upload it to cloudinary

  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: 'NodeNet',
      resource_type: 'image',
    });
    postImg = secure_url;
  }

  // The logged in user's id is recieved from the protect middleware, and used as the author of the post.

  const post = await Post.create({
    postMessage,
    author: req.userId,
    img: postImg,
  });

  post.populate('author');

  // Add the post to the user that created it, which will be the logged in user since only logged in users can create posts

  const user = await User.findById(req.userId);

  user.posts = [...user.posts, post];
  await user.save();

  res.status(201).json(post);
});

module.exports = {
  createPost,
};
