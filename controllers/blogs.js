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

  if (!blog.likes) {
    console.log('there is no likes property');
    /*
     const defaultBlog = { ...blog.toObject(), likes: 0 };
     - can't figure why it's not working on save()
     */
    blog.likes = 0;
    // defaultBlog.likes = 0;
    // console.log('blog is ', blog);
    // console.log('default blog is now ', defaultBlog, defaultBlog.likes);
    const modifiedBlog = await blog.save();
    response.status(201).json(modifiedBlog);
  } else if (!blog.url || !blog.title) {
    console.log('title or url address is missing');
    return response.status(400).end();
  } else {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
