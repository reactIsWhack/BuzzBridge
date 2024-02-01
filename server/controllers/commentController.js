const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

const createComment = asyncHandler(async (req, res) => {
  // Get postId and find post that is being commented on.
  const { postId } = req.params;
  const { commentMessage } = req.body;

  const post = await Post.findById(postId);

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
  await post.save();

  // Return the post with the new comment
  res.status(200).json(post);
});

module.exports = { createComment };
