const blogsRouter = require('express').Router();
const Blog = require('../models/post');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((newBlog) => {
    response.status(201).json(newBlog);
  });

  console.log(request.body);
});

module.exports = blogsRouter;
