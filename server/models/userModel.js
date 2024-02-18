const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      validate: {
        validator: function (value) {
          return isEmail(value);
        },
        message: 'Invalid Email Address',
      },
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [7, 'Password must be at least 7 characters'],
    },
    photo: {
      type: String,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    // When a user makes a friend request, their id will be added to the requested users friendRequest array.
    // If the user accepts the friend request, the id of the accepted user is removed from the friendRequests and added to the friends array.
    friends: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'post' }],
    // Each user will have their own posts array, which will be an array of ObjectId's refrencing the post model.
    isFake: Boolean,
  },
  { timestamps: true, versionKey: false }
);

// Before saving user to the database, hash the password

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;
