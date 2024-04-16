const request = require('supertest');
const { decode } = require('jsonwebtoken');
const User = require('../models/userModel');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('../index');
const { loginTestUser } = require('./userHelper');

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany({});
});

let jwt;

describe('POST /users auth', () => {
  it('Should fail to register a user if the confirmPassword does not match the password', async () => {
    const response = await request(app)
      .post('/api/users/registeruser')
      .send({
        firstName: 'test',
        lastName: 'jest',
        email: 'test@gmail.com',
        password: 'test1234',
        confirmPassword: 'test123',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Passwords do not match');
  });

  it('Should fail to login a user if they are not registered', async () => {
    const response = await request(app)
      .post('/api/users/loginuser')
      .send({ email: 'test@gmail.com', password: 'test1234', isTesting: true })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('User not registered, please login');
  });

  it('Should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/registeruser')
      .send({
        firstName: 'test',
        lastName: 'jest',
        email: 'test@gmail.com',
        password: 'test1234',
        confirmPassword: 'test1234',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    console.log(response.body);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: 'test',
        lastName: 'jest',
        email: 'test@gmail.com',
      })
    );
    expect(response.body._id).toBeTruthy();
    expect(response.header['set-cookie']).toBeTruthy();
  });

  it('Should login the test user successfully', async () => {
    const response = await request(app)
      .post('/api/users/loginuser')
      .send({ email: 'test@gmail.com', password: 'test1234', isTesting: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: 'test',
        lastName: 'jest',
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

  it('Should fail to login the user by not entering an email or password', async () => {
    const response = await request(app)
      .post('/api/users/loginuser')
      .send({ email: 'test@gmail.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('All fields are required');
  });

  it('Should fail to register a user with an email that has already been registered', async () => {
    const response = await request(app)
      .post('/api/users/registeruser')
      .send({
        firstName: 'test',
        lastName: 'jest',
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
      .get('/api/users/user/0')
      .set('Cookie', [...jwt])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Not authorized, please login');
  });

  it('Should block api route when a token is missing in the request', async () => {
    const response = await request(app)
      .get('/api/users/user/0')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Not authorized, please login');
  });

  it('Should block api route when the jwt has been tampered with', async () => {
    const invalidJWT = jwt[0].split('=')[1].slice(0, 20);

    const response = await request(app)
      .get('/api/users/user/0')
      .set('Cookie', [invalidJWT])
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
      .get('/api/users/user/0')
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

describe('Changing user passwords', () => {
  let JWT;
  beforeEach(async () => {
    const { token, user } = await loginTestUser('test@gmail.com', 'test1234');
    JWT = token;
  });

  it('Should fail to change password if the wrong current password is entered', async () => {
    const response = await request(app)
      .patch('/api/users/update')
      .set('Cookie', [...JWT])
      .send({
        currentPassword: 'test123',
        newPassword: 'test12345',
        confirmPassword: 'test12345',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Current password is not correct');
  });

  it('Should fail to change password if the new password does not match the confirm password', async () => {
    const response = await request(app)
      .patch('/api/users/update')
      .set('Cookie', [...JWT])
      .send({
        currentPassword: 'test1234',
        newPassword: 'test12345',
        confirmPassword: 'test12',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Passwords do not match');
  });

  it("Should successfully change the user's password", async () => {
    const response = await request(app)
      .patch('/api/users/update')
      .set('Cookie', [...JWT])
      .send({
        currentPassword: 'test1234',
        newPassword: 'test12345',
        confirmPassword: 'test12345',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Password Updated!');
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
