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
let patchTestPost;

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
  await generateFakeUsers(true);
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

describe('GET /api/posts', () => {
  let allPosts = [];
  let randomUser;
  let randomUserPosts = [];

  it('Should get 25 posts', async () => {
    // controller function limits query to 25 posts
    const response = await request(app)
      .get(`/api/posts/allposts/${new Date(Date.now())}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    randomUser = response.body[9].author;
    allPosts = [...allPosts, ...response.body];
    expect(response.body.length).toBe(25);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postMessage: expect.any(String),
          author: expect.any(Object),
          likes: expect.any(Object),
          comments: expect.arrayContaining([]),
        }),
      ])
    );
  });

  it('Should get the remaining older posts', async () => {
    const response = await request(app)
      .get(`/api/posts/allposts/${new Date(allPosts[24].createdAt)}`) // starts querying at the oldest created post from the original 25
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    patchTestPost = response.body[0];
    allPosts = [...allPosts, ...response.body];
    expect(allPosts.length).toBeGreaterThan(30);
    expect(arrayHasDuplicates(allPosts.map((post) => post._id))).toBe(false);
    expect(allPosts).toEqual(
      allPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
  });

  it('Should get 3 posts of a random user', async () => {
    const response = await request(app)
      .get(`/api/posts/userposts/${randomUser._id}/${new Date(Date.now())}`) // starts querying at the oldest created post from the original 25
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    randomUserPosts = [...response.body];
    expect(response.body.length).toBe(3);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postMessage: expect.any(String),
          author: expect.any(Object),
          likes: expect.any(Object),
          comments: expect.arrayContaining([]),
        }),
      ])
    );
  });

  it('Should get any remaining posts of the random user', async () => {
    const response = await request(app)
      .get(
        `/api/posts/userposts/${randomUser._id}/${new Date(
          randomUserPosts[2].createdAt
        )}`
      ) // starts querying at the oldest created post from the original 25
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    randomUserPosts = [...randomUserPosts, ...response.body];

    if (response.body.length) {
      // user might only have three posts, so could return empty arr
      expect(randomUserPosts).toEqual(
        randomUserPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );
      expect(
        arrayHasDuplicates(randomUserPosts.map((item) => item._id))
      ).toBeFalsy();
    } else {
      expect(response.body.length).toBe(0);
    }
  });
});

describe('PATCH /api/posts', () => {
  it('Should like a fake user post', async () => {
    const response = await request(app)
      .patch(`/api/posts/likepost/${patchTestPost._id}`)
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
  });

  it('Should dislike one post from the fake posts', async () => {
    const response = await request(app)
      .patch(`/api/posts/likepost/${patchTestPost._id}`)
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
