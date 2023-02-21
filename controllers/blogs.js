const blogsRouter = require('express').Router();
const Blog = require('../models/post');

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({});
  response.json(blogList);
});

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const post = await Blog.findById(request.params.id);
    if (post) {
      response.json(post);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);

  try {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
