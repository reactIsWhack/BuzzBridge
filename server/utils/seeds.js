const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');

const generateFakeUsers = async () => {
  const usersGenerated = await User.find();

  // the testingUser is a user that tests the features of the app, such as making and accepting friendRequests
  const testingUser = await User.findOne({ email: 'packer.slacker@gmail.com' });

  // If fake users have already been generated, then return as more than 10 fake users is not needed for testing purposes

  if (usersGenerated.length >= 10) {
    return;
  }

  // Generate 10 fake users

  for (let i = 0; i < 10; i++) {
    // Gets fake users to populate the friends array for some users
    const users = await User.find({ isFake: true });
    const randomIndex = Math.floor(Math.random() * users.length);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const fakeUser = {
      name: firstName + ' ' + lastName, // Generated first and last names to avoid having Dr., ms., mr., ect in the name
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.paragraph(),
      // Every fake user will have the testingUser as a friend for testing purposes
      friends:
        users.length > 5
          ? [testingUser._id, users[randomIndex]]
          : [testingUser._id], // Generates multiple friends for some users depending on their index in the users array
      isFake: true,
    };

    const createdUser = await User.create(fakeUser);

    // Add the fake users to the testingUsers friends
    testingUser.friends = [...testingUser.friends, createdUser._id];
    await testingUser.save();
  }
};

module.exports = generateFakeUsers;
