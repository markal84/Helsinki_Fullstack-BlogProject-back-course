const { totalLikes } = require('../utilis/list_helper');
const { listWithNoBlogs, listWithOneBlog, blogs } = require('./blogsList');

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = totalLikes(listWithNoBlogs);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(2);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(blogs);
    expect(result).toBe(31);
  });
});
