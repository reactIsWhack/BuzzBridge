const request = require('supertest');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const app = require('../index');
const { loginTestUser } = require('./userHelper');
const { generateFakeUsers, generateFakePosts } = require('../utils/seeds');
const arrayHasDuplicates = require('../utils/checkDuplicates');
const fs = require('fs');
const removeAllImagesFromUploads = require('../utils/wipeUploadsFolder');

let jwt;
let testUser;

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany({});
  await Post.deleteMany({});
  await User.create({
    firstName: 'test',
    lastName: 'jest',
    email: 'test@gmail.com',
    password: 'test1234',
  });
  await generateFakeUsers();
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
        img: expect.objectContaining({
          src: expect.any(String),
          fileType: 'image/jpeg',
        }),
        comments: [],
        likes: { total: 0, usersLiked: [] },
      })
    );
    expect(String(response.body.author._id)).toBe(String(testUser._id));
    testUser.posts = [...testUser.posts, response.body];
  });

  it('Should create a new post with a video', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Cookie', [...jwt])
      .attach('photo', `${__dirname}/testVideo.mp4`)
      .field({ postMessage: 'Cool Cat!' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        postMessage: 'Cool Cat!',
        img: expect.objectContaining({
          src: expect.any(String),
          fileType: 'video/mp4',
        }),
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
  const allPosts = [];
  it('Should get the test user posts and their friends posts', async () => {
    const response = await request(app)
      .get('/api/posts/allposts/0/0')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    allPosts.push(...response.body);
    expect(response.body.length).toBe(27);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: expect.objectContaining({ _id: testUser._id }),
          postMessage: expect.any(String),
          likes: { total: 0, usersLiked: [] },
          comments: [],
          img: expect.any(Object),
        }),
      ])
    );
    // Ensure the test user's post is first since it created the first post.
    randomPosts = [response.body[3], response.body[5]];
  });

  // The client should be able to view more posts when they scroll to the bottom of the page, so this test ensures that more unique posts can be loaded.

  it('Should get the remaining test user posts and their friends posts', async () => {
    const response = await request(app)
      .get('/api/posts/allposts/25/2')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    allPosts.push(...response.body);
    // Ensures the newly loaded posts and the previous posts do not have duplicate values, and it is sorted by latest
    expect(arrayHasDuplicates(allPosts.map((post) => post._id))).toBeFalsy();
    expect(allPosts).toEqual(
      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
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
          img: expect.any(Object),
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
      .attach('photo', `${__dirname}/testVideo.mp4`)
      .field({ contentMessage: 'Meow Meme', contentType: 'post' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.postMessage).toBe('Meow Meme');
    expect(response.body.img).toEqual(
      expect.objectContaining({
        src: expect.any(String),
        fileType: 'video/mp4',
      })
    );
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
    expect(updatedTestUser.posts.length).toBe(1);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
  // Removes test images created from the test post
  await removeAllImagesFromUploads('uploads');
});
