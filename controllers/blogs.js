const blogsRouter = require('express').Router();
const Blog = require('../models/post');
const User = require('../models/users');

// get blogs
blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  });
  response.json(blogList);
});

// get blog
blogsRouter.get('/:id', async (request, response) => {
  const post = await Blog.findById(request.params.id);
  if (post) {
    response.json(post);
  } else {
    response.status(404).end();
  }
});

// post
blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findById(body.userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  });

  if (!blog.likes) {
    // console.log('there is no likes property');
    blog.likes = 0;
  } else if (!blog.url || !blog.title) {
    // console.log('title or url address is missing');
    return response.status(400).end();
  } else {
    console.log('all okay');
  }

  const newBlog = await blog.save();
  // eslint-disable-next-line no-underscore-dangle
  user.posts = user.posts.concat(newBlog._id);
  await user.save();
  response.status(201).json(newBlog);
});

// update - task 4.14
blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };
  // console.log(blog);
  if (blog) {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).json({ message: 'Update successful' });
  } else {
    response.status(404).end();
  }
});

// delete - task 4.13
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
