const request = require('supertest');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const { loginTestUser } = require('./userHelper');
const { generateFakeUsers, generateFakePosts } = require('../utils/seeds');
const app = require('../index');
const mongoose = require('mongoose');

let testUser;
let jwt;
let testingPost;
let commentId;

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await User.create({
    name: 'test',
    email: 'test@gmail.com',
    password: 'test1234',
  });
  await generateFakeUsers();
  await generateFakePosts();
  const { token, user } = await loginTestUser('test@gmail.com', 'test1234');
  jwt = token;
  testUser = user;
  testingPost = testUser.friends[0].posts[0];
}, 9000);

describe('POST /api/comments', () => {
  it('Should create a new comment', async () => {
    const response = await request(app)
      .post(`/api/comments/${testingPost._id}`)
      .set('Cookie', [...jwt])
      .send({ commentMessage: 'Cool!' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    commentId = response.body.comments[0]._id;
    expect(response.body.comments.length).toBe(1);
    expect(response.body.comments[0]).toEqual(
      expect.objectContaining({
        commentMessage: 'Cool!',
        author: expect.objectContaining({ _id: testUser._id }),
        likes: { total: 0, usersLiked: [] },
      })
    );
  });

  it('Should fail to create a comment if the commentMessage is not sent in the request', async () => {
    const response = await request(app)
      .post(`/api/comments/${testingPost._id}`)
      .set('Cookie', [...jwt])
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Please enter a message');
  });

  it('Should fail to create a comment if an invalid post id is passed in the params', async () => {
    const response = await request(app)
      .post(`/api/comments/${testUser._id}`)
      .set('Cookie', [...jwt])
      .expect(404)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Post not found');
  });
});

describe('GET /api/comments', () => {
  it('Should get all the comments from a post', async () => {
    const response = await request(app)
      .get(`/api/comments/${testingPost._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        commentMessage: 'Cool!',
        author: expect.objectContaining({ _id: testUser._id }),
        likes: { total: 0, usersLiked: [] },
      })
    );
  });
});

describe('PATCH /api/comments', () => {
  let fakeUserId;
  it('Should like a comment', async () => {
    // Login as a fakeUser to test if a user besides the author can like the comment
    const { token, user } = await loginTestUser(
      testUser.friends[0].email,
      process.env.FAKE_USER_PASSWORD
    );
    fakeUserId = user._id;
    const response = await request(app)
      .patch(`/api/comments/likecomment/${commentId}`)
      .set('Cookie', [...token])
      .send({ isLiking: true, content: 'comment' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body._id).toBe(commentId);
    expect(response.body.likes).toEqual({
      total: 1,
      usersLiked: expect.arrayContaining([
        expect.objectContaining({ _id: user._id }),
      ]),
    });
  });

  it('Should edit the comment message', async () => {
    const response = await request(app)
      .patch(`/api/comments/editcomment/${commentId}`)
      .set('Cookie', [...jwt])
      .send({ contentMessage: 'Good Luck!', contentType: 'comment' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.commentMessage).toBe('Good Luck!');
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: commentId,
        likes: { total: 1, usersLiked: [fakeUserId] },
        author: expect.objectContaining({ _id: testUser._id }),
      })
    );
  });
});

describe('DELETE /api/comments', () => {
  it('Should delete a comment of the logged in user', async () => {
    const response = await request(app)
      .delete(`/api/comments/${testingPost._id}/${commentId}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.comments.length).toBeFalsy();
  });
});

afterAll(async () => disconnectMongoDB());
