/* eslint-disable no-underscore-dangle */
const Blog = require('../models/post');

const initialPosts = [
  {
    title: 'Wiedzmin',
    author: 'Andrzej Sapkowski',
    url: 'http://sapkowski.pl',
    likes: 2
  },
  {
    title: 'Lord of the ring',
    author: 'JJR Tolkien',
    url: 'http://tolkien.pl',
    likes: 6
  }
];

const nonExistingId = async () => {
  const post = new Blog({
    title: 'Temporary',
    author: 'Temporary author'
  });

  await post.save();
  await post.remove();

  return post._id.toString();
};

const postsInDb = async () => {
  const posts = await Blog.find({});
  return posts.map((post) => post.toJSON());
};

module.exports = {
  initialPosts,
  nonExistingId,
  postsInDb
};
