const dummy = (blogs) => {
  return blogs;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map((prop) => prop.likes).reduce((prev, next) => prev + next);
};

const mostLikes = (blogs) => {
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
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs
};
