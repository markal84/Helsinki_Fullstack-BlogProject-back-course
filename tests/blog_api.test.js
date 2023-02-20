/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('posts are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two posts', async () => {
  const res = await api.get('/api/blogs');

  expect(res.body).toHaveLength(2);
});

test('the first post has Wiedzmin as a title', async () => {
  const res = await api.get('/api/blogs');

  expect(res.body[0].title).toBe('Wiedzmin');
});

afterAll(async () => {
  await mongoose.connection.close();
});
