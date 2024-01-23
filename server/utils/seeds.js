const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');

const generateFakeUsers = async () => {
  const usersGenerated = await User.find();
  // If 10 fake users have already been generated, then return as more than 10 fake users is not needed for testing purposes

  if (usersGenerated.length) {
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
    const friends = [];

    // Generates a friend for 4 fake users (don't want every fake user to have a friend)
    if (users.length > 5) {
      friends.push(users[randomIndex]);
    }

    await User.create({ name, email, password, bio, friends, isFake: true });
  }
};

module.exports = generateFakeUsers;
