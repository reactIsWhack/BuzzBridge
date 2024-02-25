const User = require('../models/userModel');
const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('../index');
const { loginTestUser, getRandomUser } = require('./userHelper');
const { generateFakeUsers } = require('../utils/seeds');
require('dotenv').config();

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany();
  await generateFakeUsers();
});

describe('POST /users', () => {
  it('Should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/registeruser')
      .send({
        name: 'test',
        email: 'test@gmail.com',
        password: 'test1234',
        confirmPassword: 'test1234',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'test',
        email: 'test@gmail.com',
      })
    );
    expect(response.body._id).toBeTruthy();
  });
});

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

  it('Should friend request three users', async () => {
    for (let i = 0; i < 3; i++) {
      const randomUser = await getRandomUser(randomUsers);
      //   randomUsers keeps track of the users that have been requested, ensuring that there are no duplicate values
      randomUsers.push(randomUser);
      const response = await request(app)
        .patch(`/api/users/friendrequest/${randomUser._id}`)
        .set('Cookie', [...token])
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const updatedRandomUser = await User.findById(randomUser._id);

      expect(response.body.message).toBe('Friend Request Sent!');
      expect(String(updatedRandomUser.friendRequests[0])).toBe(
        String(user._id)
      );
    }
  });

  it('Should accept the friendRequest of the user who sent the request', async () => {
    // Login the randomUser that was sent the request and accept the friendRequest
    for (let i = 0; i < randomUsers.length; i++) {
      const randomUser = randomUsers[i];
      const user2Data = await loginTestUser(
        randomUser.email,
        process.env.FAKE_USER_PASSWORD
      );
      const response = await request(app)
        .patch(
          `/api/users/acceptfriendrequest/${user2Data.user.friendRequests[0]._id}`
        )
        .set('Cookie', [...user2Data.token])
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const updatedTestingUser = await User.findOne({
        email: 'test@gmail.com',
      });
      // Ensure three friends were added to the testingUser and the randomUser also has the testingUser in their friends array, and vice versa
      i === 3 && expect(updatedTestingUser.friends.length).toBe(3);
      expect(updatedTestingUser.friends).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: randomUser._id }),
        ])
      );
      expect(String(response.body.friends[0]._id)).toBe(
        String(updatedTestingUser._id)
      );
    }
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
});

afterAll(async () => disconnectMongoDB());
