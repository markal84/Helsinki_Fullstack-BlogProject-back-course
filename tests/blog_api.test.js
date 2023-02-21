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

test('post without title and / or author is not added', async () => {
  const newPost = {
    url: 'http://sking.pl',
    likes: 11
  };

  await api.post('/api/blogs').send(newPost).expect(400);

  const postsAtEnd = await postsInDb();

  expect(postsAtEnd).toHaveLength(initialPosts.length);
});

test('a specific post can be viewed', async () => {
  const postsAtStart = await postsInDb();
  const postToView = postsAtStart[0];

  const resultPost = await api
    .get(`/api/blogs/${postToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultPost.body).toEqual(postToView);
});

test('a note can be deleted', async () => {
  const postsAtStart = await postsInDb();
  const postToDelete = postsAtStart[0];

  await api.delete(`/api/blogs/${postToDelete.id}`).expect(204);

  const postsAtEnd = await postsInDb();

  /*
  console.log('posts after delete', postsAtEnd);
  console.log('postsAtEnd length after delete', postsAtEnd.length);
  console.log('initialPost length', initialPosts.length);
  console.log(`Expect ${postsAtEnd.length} to be ${initialPosts.length - 1}`);
  */

  expect(postsAtEnd).toHaveLength(initialPosts.length - 1);

  const authors = postsAtEnd.map((a) => a.author);
  expect(authors).not.toContain(postToDelete);
});

afterAll(async () => {
  await mongoose.connection.close();
});
