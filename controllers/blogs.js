const blogsRouter = require('express').Router();
const Blog = require('../models/post');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
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
