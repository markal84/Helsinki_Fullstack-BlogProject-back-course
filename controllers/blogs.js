const blogsRouter = require('express').Router();
const Blog = require('../models/post');

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({});
  response.json(blogList);
});

blogsRouter.get('/:id', async (request, response) => {
  const post = await Blog.findById(request.params.id);
  if (post) {
    response.json(post);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const newBlog = await blog.save();
  response.status(201).json(newBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
