const { favoriteBlog } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('Most likes', () => {
  test('of empty list returns no object', () => {
    const result = favoriteBlog(listWithNoBlogs);
    expect(result).toBe('There is no blogs');
  });

  test('of list with only one blog, equals that blog', () => {
    const result = favoriteBlog(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog);
  });

  test('of list with many blogs, equals to blog with the most likes', () => {
    const result = favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });
});
