const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    postMessage: {
      type: String,
      required: [true, 'Please enter a messsage'],
    },
    likes: Number,
    // Auther refrences to the user, where the logged in user id will be the author id
    author: {
      type: Schema.ObjectId,
      ref: 'user',
    },
    img: {
      type: String,
      default: '',
    },
    // Each post will have an array of comments.
    // When a comment is created, the post being commented will be queryed and the id of the created comment will be added to the queryed post.
    comments: {
      type: [{ type: Schema.ObjectId, ref: 'comment' }],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('post', postSchema);
module.exports = Post;
