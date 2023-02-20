/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Post = require('../models/post');

const initialPosts = [
  {
    title: 'Wiedzmin',
    author: 'Andrzej Sapkowski',
    url: 'http://sapkowski.pl',
    likes: 2
  },
  {
    title: 'Lord of the ring',
    author: 'JJR olkien',
    url: 'http://tolkien.pl',
    likes: 6
  }
];

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

test('there are two posts', async () => {
  const res = await api.get('/api/blogs');

  expect(res.body).toHaveLength(initialPosts.length);
});

test('a specific post has Wiedzmin as a title', async () => {
  const res = await api.get('/api/blogs');

  const authors = res.body.map((post) => post.title);
  expect(authors).toContain('Wiedzmin');
});

afterAll(async () => {
  await mongoose.connection.close();
});
