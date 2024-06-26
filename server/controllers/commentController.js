const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

const createComment = asyncHandler(async (req, res) => {
  // Get postId and find post that is being commented on.
  const { postId } = req.params;
  const { commentMessage } = req.body;

  const post = await Post.findById(postId.toString());

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Create comment using message from the body and the logged in user's id from the protect middleware

  const comment = await Comment.create({
    commentMessage,
    likes: { total: 0, usersLiked: [] },
    author: req.userId,
    replies: [],
  });

  // Add the comments id to the array of comments in the post

  post.comments = [...post.comments, comment._id];
  await post.save().then((post) =>
    post.populate([
      {
        path: 'comments',
        model: 'comment',
        populate: [
          {
            path: 'author',
            model: 'user',
            select: ['-password', '-posts'],
          },
          { path: 'likes', populate: { path: 'usersLiked', model: 'user' } },
        ],
      },
      { path: 'author', select: ['-password', '-posts'] },
    ])
  );

  // Return the post with the new comment
  res.status(201).json(post);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  // To delete a comment, find the post it was created in and delete the specified comment from the array and collection
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments = post.comments.filter(
    (comment) => String(comment) !== String(commentId)
  );

  await Comment.findByIdAndDelete(commentId);

  const updatedPost = await post.save().then((post) =>
    post.populate([
      {
        path: 'author',
        model: 'user',
        select: ['-password', '-posts'],
      },
      {
        path: 'comments',
        model: 'comment',
        populate: {
          path: 'author',
          model: 'user',
          select: ['-password', '-posts'],
        },
      },
    ])
  );

  res.status(200).json(updatedPost);
});

const getComments = asyncHandler(async (req, res) => {
  // Since each post has an array of comments, recieve a postId to find the desired comments from a post
  const { postId } = req.params;

  // Retrieve the comments from the post requested by the user
  const post = await Post.findById(postId).populate({
    path: 'comments',
    model: 'comment',
    populate: [
      {
        path: 'author',
        model: 'user',
        select: ['-password', '-posts'],
      },
      {
        path: 'likes',
        populate: {
          path: 'usersLiked',
          model: 'user',
          select: ['-password', '-posts', '-friends'],
        },
      },
    ],
  });

  res.status(200).json(post.comments);
});

module.exports = { createComment, deleteComment, getComments };
