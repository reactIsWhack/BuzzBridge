const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    commentMessage: {
      type: String,
      required: [true, 'Please enter a message'],
    },
    likes: Object,
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    // Each comment will have an array of replies represented as ObjectId's. These are populated when getting posts.
    replies: { type: [{ type: Schema.Types.ObjectId, ref: 'reply' }] },
  },
  { timestamps: true }
);

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
