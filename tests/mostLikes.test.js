const { mostLikes } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('Most likes', () => {
  test('of empty list returns no object', () => {
    const result = mostLikes(listWithNoBlogs);
    expect(result).toBe('There is no blogs');
  });

  test('of list with only one blog, equals that blog', () => {
    const result = mostLikes(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog);
  });

  test('of list with many blogs, equals to blog with the most likes', () => {
    const result = mostLikes(blogs);
    expect(result).toEqual(blogs[2]);
  });
});
