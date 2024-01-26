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

    const name = firstName + ' ' + lastName; // Generated first and last names to avoid having Dr., ms., mr., ect in the name
    const email = faker.internet.email();
    const password = faker.internet.password();
    const bio = faker.lorem.paragraph();
    // Every fake user will have the testingUser as a friend for testing purposes
    const friends = [testingUser._id];

    // Generates a friend for 4 fake users (don't want every fake user to have a friend)
    if (users.length > 5) {
      friends.push(users[randomIndex]);
    }

    const createdUser = await User.create({
      name,
      email,
      password,
      bio,
      friends,
      isFake: true,
    });

    // Add the fake users to the testingUsers friends
    testingUser.friends = [...testingUser.friends, createdUser._id];
    await testingUser.save();
  }
};

module.exports = generateFakeUsers;
