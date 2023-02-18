// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

const dummy = (blogs) => {
  return blogs;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map((prop) => prop.likes).reduce((prev, next) => prev + next);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 'There is no blogs';
  }

  if (blogs.length === 1) {
    return blogs;
  }

  const maxLikes = Math.max(...blogs.map((prop) => prop.likes));
  const result = blogs.find((blog) => blog.likes === maxLikes);
  return result;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'There is no blogs';
  }

  if (blogs.length === 1) {
    const author = {
      author: blogs[0].author,
      blogs: 1
    };
    return author;
  }

  const authorOcc = _.countBy(blogs, (name) => name.author);
  const blogsNumber = Object.entries(authorOcc);

  const result = {
    author: blogsNumber[0][0],
    blogs: blogsNumber[0][1]
  };
  console.log(result);
  return result;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'There is no blogs';
  }

  if (blogs.length === 1) {
    const author = {
      author: blogs[0].author,
      likes: blogs[0].likes
    };
    return author;
  }

  // if author has more than one blog sum likes and return new list
  const holder = {};
  blogs.forEach((prop) => {
    if (holder.hasOwnProperty(prop.author)) {
      holder[prop.author] += prop.likes;
    } else {
      holder[prop.author] = prop.likes;
    }
  });

  const result = [];
  for (let prop in holder) {
    result.push({ author: prop, likes: holder[prop] });
  }

  // console.log(result);

  // sort list by likes
  const sorted = _.orderBy(result, [(prop) => prop.likes], ['desc']);
  // console.log('after sorting ', sorted);
  return sorted[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
