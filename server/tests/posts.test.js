const request = require('supertest');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('..');
const { loginTestUser } = require('./userHelper');
const {
  generateFakeUsers,
  populateFakeUserFriends,
  generateFakePosts,
} = require('../utils/seeds');

let jwt;
let testUser;

beforeAll(async () => {
  await initializeMongoDB();
  await Post.deleteMany();
  await User.deleteMany();
  await User.create({
    name: 'test',
    email: 'test@gmail.com',
    password: 'test1234',
  });
  await generateFakeUsers();
  await populateFakeUserFriends();
  await generateFakePosts();
  const { token, user } = await loginTestUser('test@gmail.com', 'test1234');
  jwt = token;
  testUser = user;
}, 9000);

describe('POST /api/posts', () => {
  it('Should create a new post with an image', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Cookie', [...jwt])
      .attach('photo', `${__dirname}/test2.jpg`)
      .field({ postMessage: 'Jordan Love!' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        postMessage: 'Jordan Love!',
        img: expect.any(String),
        comments: [],
        likes: { total: 0, usersLiked: [] },
      })
    );
    expect(String(response.body.author._id)).toBe(String(testUser._id));
    testUser.posts = [...testUser.posts, response.body];
  });

  it('Should fail to create a post if a postMessage is not sent in the request', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Cookie', [...jwt])
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Please enter a message');
  });
});

let randomPosts;

describe('GET /api/posts', () => {
  it('Should get the test user posts and their friends posts', async () => {
    const response = await request(app)
      .get('/api/posts/allposts')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBeGreaterThan(30);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: testUser.posts[0]._id }),
      ])
    );
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postMessage: expect.any(String),
          likes: { total: 0, usersLiked: [] },
          author: expect.any(Object),
        }),
      ])
    );
    randomPosts = [response.body[3], response.body[5]];
  });

  it('Should get the posts of the test user', async () => {
    const response = await request(app)
      .get('/api/posts/userposts')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBeTruthy();
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postMessage: 'Jordan Love!',
          img: expect.any(String),
          likes: expect.any(Object),
          author: expect.objectContaining({ _id: testUser._id }),
        }),
      ])
    );
  });
});

describe('PATCH /api/posts', () => {
  it('Should like a fake user post', async () => {
    for (const randomPost of randomPosts) {
      const response = await request(app)
        .patch(`/api/posts/likepost/${randomPost._id}`)
        .set('Cookie', [...jwt])
        .send({ isLiking: true, content: 'post' })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toEqual({
        total: 1,
        usersLiked: expect.arrayContaining([
          expect.objectContaining({ _id: testUser._id }),
        ]),
      });
    }
  });

  it('Should dislike one post from the fake posts', async () => {
    const response = await request(app)
      .patch(`/api/posts/likepost/${randomPosts[0]._id}`)
      .set('Cookie', [...jwt])
      .send({ isLiking: false, content: 'post' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toEqual({ total: 0, usersLiked: [] });
  });

  it('Should edit the post created by the test user', async () => {
    const response = await request(app)
      .patch(`/api/posts/editpost/${testUser.posts[0]._id}`)
      .set('Cookie', [...jwt])
      .attach('photo', `${__dirname}/test3.jpg`)
      .field({ contentMessage: "I'm lovin this year!", contentType: 'post' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.postMessage).toBe("I'm lovin this year!");
    expect(response.body.img).toBeTruthy();
  });
});

describe('DELETE /api/posts', () => {
  it('Should delete one post from the test user', async () => {
    const response = await request(app)
      .delete(`/api/posts/${testUser.posts[0]._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedTestUser = await User.findById(testUser._id);
    expect(response.body.message).toBe('Post Deleted!');
    expect(updatedTestUser.posts.length).toBeFalsy();
  });
});

afterAll(async () => disconnectMongoDB());
