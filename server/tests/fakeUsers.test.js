const User = require('../models/userModel');
const arrayHasDuplicates = require('../utils/checkDuplicates');
const { initializeMongoDB, disconnectMongoDB } = require('../utils/config');
const {
  generateFakeUsers,
  populateFakeUserFriends,
  generateFakePosts,
} = require('../utils/seeds');

beforeAll(async () => {
  await initializeMongoDB();
  await User.deleteMany();
});

describe('Fake User Testing', () => {
  // fakeUser specifies the structure of a fake generated user, so it can check for certian properties
  const fakeUser = {
    name: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    photo: expect.any(String),
    coverPhoto: expect.any(String),
    friends: expect.any(Array),
    friendRequests: expect.any(Array),
    posts: expect.any(Array),
  };

  it('Should generate fake users and have properties including (name, id, email, photo)', async () => {
    await generateFakeUsers(true);
    const fakeUsers = await User.find({ isFake: true });

    expect(fakeUsers.length).toBeTruthy();
    expect(fakeUsers).toEqual(
      expect.arrayContaining([expect.objectContaining(fakeUser)])
    );
  }, 9000);

  it('Should generate friends for all fakeUsers', async () => {
    const usersWithFriends = await populateFakeUserFriends();

    // Ensure there are friends in each users friend's array
    expect(usersWithFriends).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...fakeUser,
          friends: expect.arrayContaining([expect.objectContaining(fakeUser)]),
        }),
      ])
    );

    // Ensure there are no duplicate friends
    usersWithFriends.forEach((user) =>
      expect(
        arrayHasDuplicates(user.friends.map((friend) => friend._id))
      ).toBeFalsy()
    );
  });

  it('Should generate 6 fake posts for all fake users', async () => {
    const usersWithPosts = await generateFakePosts();

    // Ensure each user has 6 posts
    expect(usersWithPosts[0].posts.length).toBeTruthy();
    const post = usersWithPosts[0].posts[0];
    expect(post.postMessage).toEqual(expect.any(String));
    expect(post.likes).toEqual(expect.any(Object));
    expect(post.author).toEqual(expect.objectContaining(fakeUser)); // Assuming fakeUser is a constructor function
    expect(post.img).toEqual(expect.any(String));
    expect(post.comments).toEqual(expect.any(Array));
  }, 9000);
});

afterAll(async () => await disconnectMongoDB());