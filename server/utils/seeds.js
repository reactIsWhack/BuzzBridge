const Post = require('../models/postModel');
const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');
const sortByInput = require('./sortByInput');
const profilePictures = require('../fakeUserData');
require('dotenv').config();

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
    if (testUser) {
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
    email: 'packer.slacker@gmail.com',
  });

  for (let j = 0; j < allFakeUsers.length; j++) {
    const fakeUser = allFakeUsers[j];
    // Ensures not all fakeUsers have the clientTesting user as a friend
    const friends = new Set(j > 55 ? [String(clientTestingUser._id)] : []);
    const randomFriendCount = Math.floor(Math.random() * (5 - 1 + 1) + 1);

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

  // Retrieve the updated fake users with populated friends
  const updatedFakeUsers = await User.find({ isFake: true }).populate(
    'friends'
  );
  return updatedFakeUsers;
};

const generateFakePosts = async () => {
  console.log('Generating posts...');
  const allFakeUsers = await User.find({ isFake: true });

  // Generates 6 fake posts for 12 users
  for (const user of allFakeUsers) {
    const fakePosts = [];
    const fakePostCount = Math.floor(Math.random() * (7 - 3 + 1) + 3);
    for (
      let fakePostIndex = 0;
      fakePostIndex < fakePostCount;
      fakePostIndex++
    ) {
      const generateImage = [false, true, false, false, true, false];
      const fakePost = {
        postMessage: '',
        img: generateImage[fakePostIndex]
          ? faker.image.urlLoremFlickr({ category: 'animals' })
          : '', // Uses the fakePostIndex to determine if an image should be generated by selecting the boolean at the generateImageForFakePost
        author: user._id,
        comments: [],
        likes: { total: 0, usersLiked: [] },
        isFake: true,
        createdAt: faker.date.between({
          from: '2022-01-01T00:00:00.000Z',
          to: Date.now(),
        }),
      };
      for (let i = 0; i < 25; i++) {
        const word = faker.word.sample();
        fakePost.postMessage += !i
          ? word[0].toUpperCase() + word.slice(1, word.length) + ' '
          : word + ' ';
      }
      fakePost.postMessage =
        fakePost.postMessage.slice(0, fakePost.postMessage.lastIndexOf(' ')) +
        '.';
      const generatedPost = await Post.create(fakePost);
      fakePost._id = generatedPost._id;
      fakePosts.push(fakePost);
    }

    user.posts = sortByInput(fakePosts, 'latest');
    await user.save();
  }

  const updatedFakeUsers = await User.find({ isFake: true }).populate({
    path: 'posts',
    model: 'post',
    populate: { path: 'author', model: 'user' },
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
  }
  //  else {
  //   await User.deleteMany({ isFake: true });
  //   const user = await User.findOne({ email: 'packer.slacker@gmail.com' });
  //   user.friends = [];
  //   await user.save();
  //   await Post.deleteMany({ isFake: true });
  // }
};

module.exports = {
  generateFakeUsers,
  populateFakeUserFriends,
  generateFakePosts,
  generateFakeDataForClient,
};
