const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/postModel');
const User = require('../models/userModel');
const sortByInput = require('../utils/sortByInput');

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

  post.populate({
    path: 'author',
    select: ['-password', '-posts'],
  });

  // Add the post to the user that created it, which will be the logged in user since only logged in users can create posts

  const user = await User.findById(req.userId);

  user.posts = [...user.posts, post];
  await user.save();

  res.status(201).json(post);
});

const getUserPosts = asyncHandler(async (req, res) => {
  // Find the logged in user by id from protect middleware and populate their posts array
  const user = await User.findById(req.userId).populate({
    path: 'posts',
    populate: {
      path: 'author',
      model: 'user',
      select: ['-password', '-posts'],
    },
  });

  res.status(200).json(user.posts);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate({
      path: 'friends',
      populate: {
        path: 'posts',
        model: 'post',
        populate: {
          path: 'author',
          model: 'user',
          select: ['-password', '-posts'],
        },
      },
    })
    .populate({
      path: 'posts',
      populate: {
        path: 'author',
        model: 'user',
        select: ['-password', '-posts'],
      },
    });

  const friendPosts = user.friends.reduce((acc, friend) => {
    if (friend.posts.length) {
      acc = [...acc, ...friend.posts];
    }

    return acc;
  }, []);

  //   Sort by input function sorts an array (first arguement) either by its oldest or latest dates depnding on the sortMethod (second arguement)

  const allPosts = sortByInput([...friendPosts, ...user.posts], 'latest');

  res.status(200).json(allPosts);
});

module.exports = {
  createPost,
  getUserPosts,
  getAllPosts,
};
