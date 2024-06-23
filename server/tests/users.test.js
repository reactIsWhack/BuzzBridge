const User = require('../models/userModel');
const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('../index');
const { loginTestUser, getRandomUser } = require('./userHelper');
const { generateFakeUsers } = require('../utils/seeds');
require('dotenv').config();

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany({});
  await generateFakeUsers();
  await User.create({
    firstName: 'test',
    lastName: 'jest',
    email: 'test@gmail.com',
    password: 'test1234',
  });
});

const userOutline = {
  firstName: expect.any(String),
  email: expect.any(String),
  bio: expect.any(String),
  friends: expect.any(Array),
  coverPhoto: expect.any(String),
};

describe('PATCH /users', () => {
  // Before each request, login the registered user and send the token in the request.
  let token;
  // user is used to verify data sent in the response
  let user;
  let randomUsers = [];

  beforeEach(async () => {
    const userData = await loginTestUser('test@gmail.com', 'test1234');
    token = userData.token;
    user = userData.user;
  });

  it('Should sent friend request to four users', async () => {
    for (let i = 0; i < 4; i++) {
      const randomUser = await getRandomUser(randomUsers);
      randomUsers.push(randomUser);
      const response = await request(app)
        .patch(`/api/users/friendrequest/${randomUser._id}`)
        .set('Cookie', [...token])
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const updatedRandomUser = await User.findById(randomUser._id);

      expect(response.body.message).toBe('Friend Request Sent!');
      expect(updatedRandomUser.friendRequests.length).toBe(1);
      expect(updatedRandomUser.friendRequests[0].toString()).toBe(
        user._id.toString()
      );
    }
  });

  it('Should accept the three friend requests sent by the test user', async () => {
    for (let i = 0; i < 3; i++) {
      const randomUser = randomUsers[i];
      const { token } = await loginTestUser(
        randomUser.email,
        process.env.FAKE_USER_PASSWORD
      );
      const response = await request(app)
        .patch(`/api/users/acceptfriendrequest/${user._id}`)
        .set('Cookie', [...token])
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const updatedTestUser = await User.findById(user._id);
      expect(response.body.friends[0]._id.toString()).toBe(user._id.toString());
      expect(
        updatedTestUser.friends.map((friend) => friend._id.toString())
      ).toContain(response.body._id.toString());
      i === 3 && expect(updatedTestUser.friends.length).toBe(3);
    }
  });

  it('Should decline a friend request sent by the test user', async () => {
    const randomUser = randomUsers[3];
    const randomUserData = await loginTestUser(
      randomUser.email,
      process.env.FAKE_USER_PASSWORD
    );
    const response = await request(app)
      .patch(`/api/users/declinefriendrequest/${user._id}`)
      .set('Cookie', [...randomUserData.token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedTestUser = await User.findById(user._id);
    expect(response.body.friendRequests.length).toBe(0);
    expect(response.body.friends.length).toBe(0);
    expect(
      updatedTestUser.friends.map((friend) => friend._id.toString())
    ).not.toContain(response.body._id.toString());
    expect(updatedTestUser.friends.length).toBe(3);
  });

  it("Should update the user's avatar", async () => {
    const response = await request(app)
      .patch('/api/users/update')
      .set('Cookie', [...token])
      .attach('avatar', `${__dirname}/test.png`)
      .field({ photoType: 'avatar' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.photo).toBeTruthy();
    expect(response.body.photo).not.toBe('https://i.ibb.co/4pDNDk1/avatar.png'); // Should not be default photo
  });

  it("Should update the user's bio", async () => {
    const response = await request(app)
      .patch('/api/users/update')
      .set('Cookie', [...token])
      .send({ bio: 'Life Long Cheesehead' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.bio).toBeTruthy();
    expect(response.body.bio).toBe('Life Long Cheesehead');
  });

  it('Should remove one friend from the test user', async () => {
    const removedFriend = user.friends[2];
    const response = await request(app)
      .patch(`/api/users/removefriend/${removedFriend._id}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // test user friends should no longer include the user who was just removed
    expect(response.body.friends.length).toBe(2);
    expect(response.body.friends).not.toContain(removedFriend);
    expect(response.body.friends).toEqual(
      expect.arrayContaining([expect.objectContaining(userOutline)])
    );
  });
});

describe('GET /users', () => {
  let token;
  let user;

  beforeEach(async () => {
    const userData = await loginTestUser('test@gmail.com', 'test1234');
    token = userData.token;
    user = userData.user;
  });

  it('Should get the profile of the logged in test user', async () => {
    const response = await request(app)
      .get('/api/users/user/0')
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: 'test',
        lastName: 'jest',
        email: 'test@gmail.com',
        photo: expect.any(String),
        friends: expect.arrayContaining([expect.objectContaining(userOutline)]),
        bio: 'Life Long Cheesehead',
      })
    );
  });

  it('Should get the profile of a friend of the test user', async () => {
    const friend = user.friends[0];
    const response = await request(app)
      .get(`/api/users/userprofile/${friend._id}/0`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(friend);
  });
});

afterAll(async () => disconnectMongoDB());
