const Post = require('../models/postModel');
const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');

const generateFakeUsers = async () => {
  const usersGenerated = await User.find();
  // the testingUser is a user that tests the features of the app, such as making and accepting friendRequests
  const testingUser = await User.findOne({ email: 'packer.slacker@gmail.com' });

  if (usersGenerated.length >= 10) {
    return;
  }

  // Generate 10 fake users

  for (let i = 0; i < 10; i++) {
    // Gets fake users to populate the friends array for fake generated users
    const users = await User.find({ isFake: true });
    const randomIndex = Math.floor(Math.random() * users.length);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Fake posts in an array of 5 fake posts for fake users
    const fakePosts = [];

    for (let i = 0; i < 5; i++) {
      const fakePost = {
        postMessage: '',
        img: faker.image.animals(),
        author: null,
        comments: [],
        likes: { total: 0, usersLiked: [] },
      };
      for (let i = 0; i < 25; i++) {
        fakePost.postMessage += faker.word.sample() + ' ';
      }
      fakePosts.push(fakePost);
    }

    const fakeUser = {
      name: firstName + ' ' + lastName,
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.paragraph(),
      friends:
        users.length > 5
          ? [testingUser._id, users[randomIndex]]
          : [testingUser._id], // Generates multiple friends for some users depending on their index in the users array
      isFake: true,
      photo: faker.image.avatar(),
    };

    const createdUser = await User.create(fakeUser);
    // Use the id of the createdUser as the author for the fakePosts
    const fakePostsWithAuthor = fakePosts.map((fakePost) => {
      fakePost.author = createdUser._id;
      return fakePost;
    });

    const post = await Post.create(...fakePostsWithAuthor);
    createdUser.posts = [...createdUser.posts, ...post];
    await createdUser.save();

    // Add the fake users to the testingUsers friends
    testingUser.friends = [...testingUser.friends, createdUser._id];
    await testingUser.save();
  }
};

module.exports = generateFakeUsers;
