const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const { faker } = require('@faker-js/faker');
const sortByInput = require('./sortByInput');
const { profilePictures, postPhotos } = require('../fakeUserData');
require('dotenv').config();
const path = require('path');

const nodeEnv = process.env.NODE_ENV;

const generateFakeUsers = async () => {
  console.log('Generating fake users...');
  const testUser = await User.findOne({ email: 'test@gmail.com' });
  for (let i = 0; nodeEnv === 'test' ? i < 10 : i < 80; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const fakeUser = {
      firstName,
      lastName,
      email: faker.internet.email(),
      password: process.env.FAKE_USER_PASSWORD,
      bio: faker.lorem.paragraph(),
      friends: testUser ? [testUser] : [],
      photo: profilePictures[i],
      coverPhoto: faker.image.urlLoremFlickr(),
      isFake: true,
    };

    const user = await User.create(fakeUser);
    if (testUser && i > 5) {
      testUser.friends = [...testUser.friends, user];
      await testUser.save();
    }
  }
};

const populateFakeUserFriends = async () => {
  console.log('Generating friends...');
  const allFakeUsers = await User.find({ isFake: true });
  // The clientTestingUser is created to recieve posts on the home page feed on the frontend from fakeUsers.
  const clientTestingUser = await User.findOne({
    email: nodeEnv === 'test' ? 'test@gmail.com' : 'packer.slacker@gmail.com',
  });
  console.log(clientTestingUser);

  for (let j = 0; j < allFakeUsers.length; j++) {
    const fakeUser = allFakeUsers[j];
    // Ensures not all fakeUsers have the clientTesting user as a friend
    const friends = new Set(j > 55 ? [String(clientTestingUser._id)] : []);
    const randomFriendCount = Math.floor(Math.random() * (5 - 1 + 1) + 1);

    if (j < 4) {
      clientTestingUser.friendRequests = [
        ...clientTestingUser.friendRequests,
        fakeUser,
      ];
    }

    // Generate random friends for the current fake user
    for (let i = 0; i < randomFriendCount; i++) {
      let randomUser;
      do {
        randomUser =
          allFakeUsers[Math.floor(Math.random() * allFakeUsers.length)];
      } while (
        friends.has(randomUser._id.toString()) ||
        randomUser._id.toString() === fakeUser._id.toString()
      );
      friends.add(String(randomUser._id));
    }

    fakeUser.friends = Array.from(friends);
    const updatedFakeUser = await fakeUser
      .save()
      .then((user) => user.populate('friends'));

    // Adds the fakeUser to the friends array of the user the fakeUser friended
    updatedFakeUser.friends.forEach(async (friend) => {
      const friendsOfFriend = new Set(
        friend.friends.map((friendId) => friendId.toString())
      );
      friendsOfFriend.add(updatedFakeUser._id.toString());
      friend.friends = Array.from(friendsOfFriend);
      await friend.save();
    });
  }
  await clientTestingUser.save();

  // Retrieve the updated fake users with populated friends
  const updatedFakeUsers = await User.find({ isFake: true }).populate(
    'friends'
  );
  return updatedFakeUsers;
};

const generatePostPhotoFileType = (generateImage, postPhotoIndex) => {
  let fileType = '';
  if (generateImage) {
    const pathExtension = path.extname(postPhotos[postPhotoIndex]);
    fileType =
      pathExtension === '.mp4'
        ? 'video/mp4'
        : `image/${pathExtension.slice(1)}`;
  }
  return fileType;
};

const generatePostMessage = (fakePost) => {
  for (let i = 0; i < 25; i++) {
    const word = faker.word.sample();
    fakePost.postMessage += !i
      ? word[0].toUpperCase() + word.slice(1, word.length) + ' '
      : word + ' ';
  }

  fakePost.postMessage =
    fakePost.postMessage.slice(0, fakePost.postMessage.lastIndexOf(' ')) + '.';
};

const generateComments = async () => {
  const comments = [];
  const numOfComments = Math.floor(Math.random() * (3 - 1) + 1);
  // Gets a random user
  for (let i = 0; i < numOfComments; i++) {
    const user = await User.aggregate([{ $sample: { size: 1 } }]);
    let commentMessage = '';
    const commentMessageLength = Math.floor(Math.random() * (10 - 4) + 4);

    for (let j = 0; j < commentMessageLength; j++) {
      commentMessage += faker.word.sample();
    }
    const fakeComment = {
      commentMessage,
      author: user[0]._id,
      likes: { total: 0, usersLiked: [] },
      createdAt: faker.date.between({
        from: '2022-01-01T00:00:00.000Z',
        to: Date.now(),
      }),
    };
    const comment = await Comment.create(fakeComment);
    comments.push(comment);
  }
  const sortedByOldest = comments.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return sortedByOldest;
};

const addCommentsToPost = async () => {
  const testUser = await User.findOne({ email: 'packer.slacker@gmail.com' });
  let fakePosts;

  // When testing, ignore the testingUser on the client, else then make sure there are comments for the posts the testUser can see
  if (testUser) {
    fakePosts = await Post.find({
      isFake: true,
      author: { $in: [...testUser.friends, testUser._id] },
    }).limit(30);
  } else {
    fakePosts = await Post.find({ isFake: true }).limit(30);
  }

  // For each post add the generated comments to it.
  for (const post of fakePosts) {
    const comments = await generateComments();
    post.comments = comments;
    await post.save();
  }
};

const generateFakePosts = async () => {
  console.log('Generating posts...');
  const allFakeUsers = await User.find({ isFake: true });
  let postPhotoIndex = 0;

  for (const user of allFakeUsers) {
    const fakePosts = [];
    const fakePostCount = Math.floor(Math.random() * (7 - 3 + 1) + 3);
    for (
      let fakePostIndex = 0;
      fakePostIndex < fakePostCount;
      fakePostIndex++
    ) {
      const generateImage = [false, true, false, false, true, false];
      const fileType = generatePostPhotoFileType(
        generateImage[fakePostIndex],
        postPhotoIndex
      );

      const fakePost = {
        postMessage: '',
        img: {
          src: generateImage[fakePostIndex] ? postPhotos[postPhotoIndex] : '',
          fileType,
        },
        author: user._id,
        comments: [],
        likes: { total: 0, usersLiked: [] },
        isFake: true,
        createdAt: faker.date.between({
          from: '2022-01-01T00:00:00.000Z',
          to: Date.now(),
        }),
      };
      generatePostMessage(fakePost);
      const generatedPost = await Post.create(fakePost);
      fakePost._id = generatedPost._id;
      fakePosts.push(fakePost);
      if (generateImage[fakePostIndex]) {
        postPhotoIndex++;
      }
    }

    user.posts = sortByInput(fakePosts, 'latest');
    await user.save();
  }
  await addCommentsToPost();

  const updatedFakeUsers = await User.find({ isFake: true }).populate({
    path: 'posts',
    model: 'post',
    populate: [
      {
        path: 'comments',
        model: 'comment',
        populate: { path: 'author', model: 'user' },
      },
      { path: 'author', model: 'user' },
    ],
  });

  return updatedFakeUsers;
};

const generateFakeDataForClient = async () => {
  const fakeUsers = await User.find({ isFake: true });
  if (fakeUsers.length < 80) {
    await generateFakeUsers();
    console.log('✅');

    await populateFakeUserFriends();
    console.log('✅');

    await generateFakePosts();
    console.log('✅');
  } else {
    await User.deleteMany({ isFake: true });
    const user = await User.findOne({ email: 'packer.slacker@gmail.com' });
    user.friends = [];
    await user.save();
    await Post.deleteMany({ isFake: true });
  }
};

module.exports = {
  generateFakeUsers,
  populateFakeUserFriends,
  generateFakePosts,
  generateFakeDataForClient,
};
