const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map((prop) => prop.likes).reduce((prev, next) => prev + next);
};

module.exports = {
  dummy,
  totalLikes
};
