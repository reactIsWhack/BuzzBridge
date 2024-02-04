const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const likeOrRemovelike = asyncHandler(async (req, res) => {
  const { isLiking, content } = req.body;
  const { id } = req.params;
  console.log(id);

  // The isLiking variable is a boolean where true means a user is liking the post, and false means a user is unliking the post.
  // The content field represents the content that is being liked, and tells whether a post, comment, or reply should be queryed to be updated.
  let likedContent;

  if (content === 'post') {
    likedContent = await Post.findById(id);
  } else if (content === 'comment') {
    likedContent = await Comment.findById(id);
  }

  console.log(likedContent);
  isLiking ? likedContent.likes.total++ : likedContent.likes.total--;
  isLiking
    ? (likedContent.likes.usersLiked = [
        ...likedContent.likes.usersLiked,
        req.userId,
      ])
    : (likedContent.likes.usersLiked = likedContent.likes.usersLiked.filter(
        (user) => String(user) !== String(req.userId)
      ));

  likedContent.markModified('likes');
  const updatedContent = await likedContent
    .save()
    .then((likedContent) =>
      content === 'post'
        ? likedContent.populate([
            {
              path: 'comments',
              model: 'comment',
              populate: {
                path: 'author',
                model: 'user',
                select: ['-password', '-posts'],
              },
            },
            {
              path: 'likes',
              populate: {
                path: 'usersLiked',
                model: 'user',
                select: ['-password', '-posts'],
              },
            },
          ])
        : likedContent.populate([
            { path: 'author', model: 'user', select: ['-password', '-posts'] },
            {
              path: 'likes',
              populate: {
                path: 'usersLiked',
                model: 'user',
                select: ['-password', '-posts'],
              },
            },
          ])
    )
    .then((likedContent) =>
      likedContent.populate({ path: 'author', select: ['-password', '-posts'] })
    );

  res.status(200).json(updatedContent);
});

module.exports = likeOrRemovelike;
