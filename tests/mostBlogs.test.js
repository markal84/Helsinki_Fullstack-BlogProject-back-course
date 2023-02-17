const { mostBlogs } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('Author with the largest amount of blogs', () => {
  test('of empty list returns no object', () => {
    const result = mostBlogs(listWithNoBlogs);
    expect(result).toBe('There is no blogs');
  });

  test('of list with only one blog, returns blog author and 1 as a number of blogs', () => {
    const result = mostBlogs(listWithOneBlog);
    expect(result).toEqual(result);
  });

  test('of list with many blogs, return author who has the most blogs and blogs number', () => {
    const result = mostBlogs(blogs);
    expect(result).toEqual(result);
  });
});
