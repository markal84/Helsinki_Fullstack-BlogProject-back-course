const blogsRouter = require('express').Router();
const Blog = require('../models/post');

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({});
  response.json(blogList);
});

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((newBlog) => {
      response.status(201).json(newBlog);
    })
    .catch((error) => next(error));

  console.log('post created ', request.body);
});

module.exports = blogsRouter;
