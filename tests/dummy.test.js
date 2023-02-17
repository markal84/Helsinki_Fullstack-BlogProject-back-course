const { dummy } = require('../utilis/list_helper');

test('dummy returns one', () => {
  const blogs = 1;
  const result = dummy(blogs);
  expect(result).toBe(1);
});
