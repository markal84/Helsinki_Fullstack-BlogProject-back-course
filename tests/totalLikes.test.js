const { totalLikes } = require('../utilis/list_helper');

describe('total likes', () => {
  const listWithNoBlogs = [];
  const listWithOneBlog = [
    {
      title: 'Test tile',
      author: 'Test author',
      likes: 2,
      id: '63ebd6a4b112059eed90361a'
    }
  ];
  const listWithManyBlogs = [
    {
      title: 'Test tile',
      author: 'Test author',
      likes: 2,
      id: '63ebd6a4b112059eed90361a'
    },
    {
      title: 'Test tile4',
      author: 'Test author4',
      url: 'http://test3.com',
      likes: 22,
      id: '63ed439d130ce8077c605cc7'
    }
  ];

  test('of empty list is zero', () => {
    const result = totalLikes(listWithNoBlogs);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(2);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithManyBlogs);
    expect(result).toBe(24);
  });
});
