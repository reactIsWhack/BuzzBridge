const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const cloudinary = require('cloudinary').v2;

const editContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const { contentMessage, contentType } = req.body;

  // Since the content varies between posts, comments, and replies the contentType specifies which one should be queryed for an update

  let queryedContent;

  // once the content is queryed, perform an update on the message using the contentMessage value

  if (contentType === 'post') {
    queryedContent = await Post.findById(contentId);
    queryedContent.postMessage = contentMessage;

    if (req.file) {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'NodeNet',
        resource_type: 'image',
      });
      queryedContent.img = secure_url;
    }

    await queryedContent.save().then((post) =>
      post.populate([
        {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'author',
            model: 'user',
            select: ['-posts', '-password'],
          },
        },
        { path: 'author', model: 'user', select: ['-password', '-posts'] },
      ])
    );
  } else {
    queryedContent = await Comment.findById(contentId);
    queryedContent.commentMessage = contentMessage;
    await queryedContent.save().then((comment) =>
      comment.populate({
        path: 'author',
        model: 'user',
        select: ['-password', '-posts'],
      })
    );
  }

  res.status(200).json(queryedContent);
});

module.exports = editContent;
