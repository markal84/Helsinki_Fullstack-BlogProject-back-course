const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./utilis/logger')

const app = express();
app.use(cors());

mongoose.set('strictQuery', true);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl =
  'mongodb+srv://kalet1984:Uh9lp1MnTMZsNuDd@kodilla.enwks.mongodb.net/blogApp?retryWrites=true&w=majority';
mongoose.connect(mongoUrl).then(() => {
  logger.info('connected to database');
});

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
