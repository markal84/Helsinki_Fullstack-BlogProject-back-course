/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { initialPosts, nonExistingId, postsInDb } = require('./test_helper');

const api = supertest(app);

const Post = require('../models/post');

beforeEach(async () => {
  await Post.deleteMany({});

  const postObj = initialPosts.map((post) => new Post(post));
  const promiseArray = postObj.map((post) => post.save());
  await Promise.all(promiseArray);
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

// test that id is present - task 4.9
test('id property of post if defined and unique', async () => {
  const ids = await postsInDb();
  const id = ids.map((t) => t.id);

  expect(id).toBeDefined();
});

// task 4.10
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

// task 4.11
test('post without likes defined will set default likes to 0', async () => {
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
test('post withouth title or url wont be saved', async () => {
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
    }
  ];

  await api.post('/api/blogs').send(newPosts[0]).expect(400);
  await api.post('/api/blogs').send(newPosts[1]).expect(400);

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
