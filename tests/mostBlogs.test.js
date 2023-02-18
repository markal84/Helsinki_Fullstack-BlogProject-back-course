const { mostBlogs } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('Author with the largest amount of blogs', () => {
  test('of empty list returns no object', () => {
    const result = mostBlogs(listWithNoBlogs);
    expect(result).toBe('There is no blogs');
  });

  test('of list with only one blog, returns blog author and 1 as a number of blogs', () => {
    const author = { author: 'Test author', blogs: 1 };
    const result = mostBlogs(listWithOneBlog);
    expect(result).toEqual(author);
  });

  test('of list with many blogs, return author who has the most blogs and blogs number', () => {
    const author = { author: 'Test author', blogs: 2 };

    const result = mostBlogs(blogs);
    expect(result).toEqual(author);
  });
});
