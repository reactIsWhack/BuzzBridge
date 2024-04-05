const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    postMessage: {
      type: String,
      required: [true, 'Please enter a message'],
    },
    // The likes object will have two properties, one is the total which represents how many likes a post has.
    // The other property will be usersLikedPost which is an array of ObjectId's of users that liked the post.
    likes: Object,
    // Auther refrences to the user, where the logged in user id will be the author id
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    img: {
      type: String,
      default: '',
    },
    // Each post will have an array of comments.
    // When a comment is created, the post being commented will be queryed and the id of the created comment will be added to the queryed post.
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    },
    isFake: Boolean,
  },
  { timestamps: true }
);

const Post = mongoose.model('post', postSchema);
module.exports = Post;
