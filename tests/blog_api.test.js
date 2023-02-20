/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { initialPosts, nonExistingId, postsInDb } = require('./test_helper');

const api = supertest(app);

const Post = require('../models/post');

beforeEach(async () => {
  await Post.deleteMany({});
  let postObject = new Post(initialPosts[0]);
  await postObject.save();
  postObject = new Post(initialPosts[1]);
  await postObject.save();
});

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

test('a specific post has Wiedzmin as a title', async () => {
  const res = await api.get('/api/blogs');

  const authors = res.body.map((post) => post.title);
  expect(authors).toContain('Wiedzmin');
});

test('a valid post can be added', async () => {
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

test('note without title and author is not added', async () => {
  const newPost = {
    url: 'http://sking.pl',
    likes: 11
  };

  await api.post('/api/blogs').send(newPost).expect(400);

  const postsAtEnd = await postsInDb();

  expect(postsAtEnd).toHaveLength(initialPosts.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
