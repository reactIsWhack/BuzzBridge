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
    try {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'NodeNet',
        resource_type: req.file.mimetype === 'video/mp4' ? 'video' : 'image',
      });
      postImg = secure_url;
    } catch (error) {
      console.log(error);
    }
  }

  // The logged in user's id is recieved from the protect middleware, and used as the author of the post.

  const post = await Post.create({
    postMessage,
    author: req.userId,
    img: { src: postImg, fileType: (req.file && req.file.mimetype) || '' },
    likes: { total: 0, usersLiked: [] }, // Total = total likes for the post, and usersLiked is an array of users that have liked the post.
  }).then((post) =>
    post.populate({
      path: 'author',
      model: 'user',
      select: ['-password', '-posts'],
    })
  );

  // Add the post to the user that created it, which will be the logged in user since only logged in users can create posts

  const user = await User.findById(req.userId);

  user.posts = sortByInput([...user.posts, post], 'latest');
  await user.save();

  res.status(201).json(post);
});

const getUserPosts = asyncHandler(async (req, res) => {
  // Find the logged in user by id from protect middleware and populate their posts array.
  // Since each post also has an array of comments, populate the comments within the posts too.
  const user = await User.findById(req.userId).populate([
    {
      path: 'posts',
      populate: {
        path: 'author',
        model: 'user',
        select: ['-password', '-posts'],
      },
    },
    {
      path: 'posts',
      populate: {
        path: 'comments',
        model: 'comment',
        populate: {
          path: 'author',
          model: 'user',
          select: ['-password', '-posts'],
        },
      },
    },
  ]);

  res.status(200).json(user.posts);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { dateQuery } = req.params;

  const user = await User.findById(req.userId);
  const oldestPost = await Post.findOne({
    author: { $in: [...user.friends, user._id] },
  }).sort({ createdAt: 1 });

  if (
    new Date(oldestPost.createdAt).getTime() === new Date(dateQuery).getTime()
  ) {
    return res.status(204).json([]);
  }

  const allPosts = await Post.find({
    author: { $in: [...user.friends, user._id] },
    createdAt: {
      $lt: Date.parse(new Date(dateQuery)),
    },
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .populate([
      { path: 'author', model: 'user', select: '-password' },
      {
        path: 'comments',
        model: 'comment',
        populate: [
          { path: 'author', model: 'user' },
          { path: 'likes', populate: { path: 'usersLiked', model: 'user' } },
        ],
      },
      { path: 'likes', populate: { path: 'usersLiked', model: 'user' } },
    ]);

  res.status(200).json(allPosts);
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  // Find the post by id and delete it, and also find the user that deleted the post and remove it from their posts array

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  await post.deleteOne();

  // Only the user that created the post can delete the post (logged in user), so the id from req.userId can be used to find this user.

  const user = await User.findById(req.userId);
  // Remove post from posts array
  user.posts = user.posts.filter((post) => String(post._id) !== id);
  await user.save();

  res.status(200).json({ message: 'Post Deleted!' });
});

module.exports = {
  createPost,
  getUserPosts,
  getAllPosts,
  deletePost,
};
