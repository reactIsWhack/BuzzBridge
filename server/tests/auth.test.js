const request = require('supertest');
const { decode } = require('jsonwebtoken');
const User = require('../models/userModel');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('../index');

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany({});
  console.log(await User.find());
  await User.create({
    name: 'test',
    email: 'test@gmail.com',
    password: 'test1234',
  });
});

let jwt;

describe('POST /users auth', () => {
  it('Should login the test user successfully', async () => {
    const response = await request(app)
      .post('/api/users/loginuser')
      .send({ email: 'test@gmail.com', password: 'test1234', isTesting: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'test',
        email: 'test@gmail.com',
        friends: [],
        friendRequests: [],
      })
    );
    expect(response.headers['set-cookie']).toBeTruthy();
    jwt = response.headers['set-cookie'];
  });

  it('Should return true for the login status after the user logins', async () => {
    const response = await request(app)
      .get('/api/users/getloginstatus')
      .set('Cookie', [...jwt])
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeTruthy();
  });

  it('Should fail to login the user by entering the wrong password', async () => {
    const response = await request(app)
      .post('/api/users/loginuser')
      .send({ email: 'test@gmail.com', password: 'test123' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('Should fail to register a user with an email that has already been registered', async () => {
    const response = await request(app)
      .post('/api/users/registeruser')
      .send({
        name: 'test',
        email: 'test@gmail.com',
        password: 'test1234',
        confirmPassword: 'test1234',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(
      'User with email already registered, please login'
    );
  });
});

describe('Invalid tokens sent to api routes', () => {
  it('Should block api route when sending an expired token', async () => {
    const response = await request(app)
      .get('/api/users/user')
      .set('Cookie', [...jwt])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Not authorized, please login');
  });

  it('Should block api route when a token is missing in the request', async () => {
    const response = await request(app)
      .get('/api/users/user')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Not authorized, please login');
  });
});

describe('Logout Users', () => {
  it('Should logout a user by expiring their jwt', async () => {
    const response = await request(app)
      .get('/api/users/logoutuser')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Ensure the jwt was deleted, and update the jwt being sent in the requests to the expired version
    jwt = response.headers['set-cookie'];

    response.headers['set-cookie'].forEach((item) => {
      expect(item.split(' ')[0]).toBe('token=;');
    });
  });

  it('Should block api routes when a user logs out', async () => {
    const response = await request(app)
      .get('/api/users/user')
      .set('Cookie', [...jwt])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Not authorized, please login');
  });

  it('Should return the loginstatus of the test user to be false after logging out', async () => {
    const response = await request(app)
      .get('/api/users/getloginstatus')
      .set('Cookie', [...jwt])
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeFalsy();
  });
});

afterAll(async () => {
  await disconnectMongoDB();
  await User.deleteOne({ email: 'test@gmail.com' });
});
