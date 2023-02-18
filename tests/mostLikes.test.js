const { mostLikes } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('Author, whose blog posts have the largest amount of likes', () => {
  test('of empty list returns no object', () => {
    const result = mostLikes(listWithNoBlogs);
    expect(result).toBe('There is no blogs');
  });

  test('of list with only one blog, returns blog author and numbers of likes', () => {
    const likes = { author: 'Test author', likes: 2 };
    const result = mostLikes(listWithOneBlog);
    expect(result).toEqual(likes);
  });

  test('of list with many blogs, return author who has the most likes', () => {
    const maxLikes = { author: 'Test author2', likes: 22 };
    const result = mostLikes(blogs);
    expect(result).toEqual(maxLikes);
  });
});
