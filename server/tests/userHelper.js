const app = require('../index');
const request = require('supertest');
const User = require('../models/userModel');

const loginTestUser = async (email, password) => {
  // userNum tells which testing user to login
  const response = await request(app).post('/api/users/loginuser').send({
    email,
    password,
  });
  const token = response.headers['set-cookie'];
  return { token, user: response.body };
};

const getRandomUser = async (randomUsers) => {
  const users = await User.find().limit(10);
  let randomUser;
  do {
    randomUser = users[Math.floor(Math.random() * users.length)];
  } while (
    randomUser.email === 'test@gmail.com' ||
    randomUsers.some((user) => String(user._id) === String(randomUser._id))
  );
  return randomUser;
};

module.exports = { loginTestUser, getRandomUser };
