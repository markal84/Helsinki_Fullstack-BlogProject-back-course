/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const {
  initialPosts,
  nonExistingId,
  postsInDb,
  usersInDb
} = require('./test_helper');

const api = supertest(app);

const Post = require('../models/post');
const User = require('../models/users');

beforeEach(async () => {
  await Post.deleteMany({});
  await Post.insertMany(initialPosts);
  /*
  const postObj = initialPosts.map((post) => new Post(post));
  const promiseArray = postObj.map((post) => post.save());
  await Promise.all(promiseArray);
  */
});

describe('when there is initially some posts saved', () => {
  test('posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all posts are returned', async () => {
    const res = await api.get('/api/blogs');

    expect(res.body).toHaveLength(initialPosts.length);
  });

  test('a specific post is within the returned posts', async () => {
    const res = await api.get('/api/blogs');

    const authors = res.body.map((post) => post.title);
    expect(authors).toContain('Wiedzmin');
  });

  // test that id is present - task 4.9
  test('id property of post if defined and unique', async () => {
    const ids = await postsInDb();
    const id = ids.map((t) => t.id);

    expect(id).toBeDefined();
  });
});

describe('viewing a specific post', () => {
  test('succeedes with a valid id', async () => {
    const postsAtStart = await postsInDb();
    const postToView = postsAtStart[0];

    const resultPost = await api
      .get(`/api/blogs/${postToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultPost.body).toEqual(postToView);
  });

  test('fails with statuscode 404 if post does not exist', async () => {
    const validNonexistingId = await nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da5970081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('addition of a new post', () => {
  // task 4.10
  test('succeeds with valid data', async () => {
    const newPost = {
      title: 'IT',
      author: 'Stephen King',
      url: 'http://sking.pl',
      likes: 11
    };

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const postsAtEnd = await postsInDb();

    expect(postsAtEnd).toHaveLength(initialPosts.length + 1);

    const titles = postsAtEnd.map((t) => t.title);
    expect(titles).toContain('IT');
  });

  // task 4.11
  test('with no likes defined with result to set likes to 0', async () => {
    const newPost = {
      title: 'IT',
      author: 'Stephen King',
      url: 'http://sking.pl'
    };

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const postsAtEnd = await postsInDb();
    expect(postsAtEnd).toHaveLength(initialPosts.length + 1);
    expect(postsAtEnd[2].likes).toEqual(0);
  });

  // task 4.12
  test('fails with status code 400 if there is no title / author / url', async () => {
    const newPosts = [
      {
        title: 'IT',
        author: 'Stephen King',
        likes: 6
      },
      {
        author: 'Stephen King2',
        url: 'https//king.com',
        likes: 8
      },
      {
        url: 'http://sking.pl',
        likes: 11
      }
    ];

    await api.post('/api/blogs').send(newPosts[0]).expect(400);
    await api.post('/api/blogs').send(newPosts[1]).expect(400);
    await api.post('/api/blogs').send(newPosts[2]).expect(400);

    const postsAtEnd = await postsInDb();

    expect(postsAtEnd).toHaveLength(initialPosts.length);
  });
});

describe('editing of a post', () => {
  // task 4.14
  test('succeeds with status code 200 if id is valid', async () => {
    const postsAtStart = await postsInDb();
    const postToEdit = postsAtStart[0];

    await api.put(`/api/blogs/${postToEdit.id}`).expect(200);
    expect(initialPosts.length).toBe(2);
  });
});

describe('deletion of a post', () => {
  // task 4.13
  test('succeeds with status code 204 if id is valid', async () => {
    const postsAtStart = await postsInDb();
    const postToDelete = postsAtStart[0];

    await api.delete(`/api/blogs/${postToDelete.id}`).expect(204);

    const postsAtEnd = await postsInDb();

    expect(postsAtEnd).toHaveLength(initialPosts.length - 1);

    const authors = postsAtEnd.map((a) => a.author);
    expect(authors).not.toContain(postToDelete);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
