const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const emptyList = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const listWithThreeBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422bb71b54a676234d17f9',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://cleancoder.com/',
    likes: 15,
    __v: 0
  },
  {
    _id: '5a422cc71b54a676234d18fa',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    url: 'https://pragprog.com/',
    likes: 12,
    __v: 0
  }
]

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithThreeBlogs)
    assert.strictEqual(result, 32)
  })
})

describe('favorite blog', () => {

  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog is the blog it self', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.strictEqual(result, listWithOneBlog[0])
  })

  test('of bigger list is found right', () => {
    const result = listHelper.favoriteBlog(listWithThreeBlogs)
    assert.strictEqual(result, listWithThreeBlogs[1])
  })
})

const testBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422bb71b54a676234d17f9',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://cleancoder.com/',
    likes: 15,
    __v: 0
  },
  {
    _id: '5a422cc71b54a676234d18fa',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    url: 'https://pragprog.com/',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422dd71b54a676234d19fb',
    title: 'Refactoring',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/books/refactoring.html',
    likes: 8,
    __v: 0
  },
  {
    _id: '5a422ee71b54a676234d20fc',
    title: 'Test-Driven Development',
    author: 'Kent Beck',
    url: 'https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ff71b54a676234d21fd',
    title: 'The Clean Coder',
    author: 'Robert C. Martin',
    url: 'https://cleancoder.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a4230071b54a676234d22fe',
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    url: 'https://www.domainlanguage.com/',
    likes: 14,
    __v: 0
  },
  {
    _id: '5a4230171b54a676234d23ff',
    title: 'Extreme Programming Explained',
    author: 'Kent Beck',
    url: 'https://www.amazon.com/Extreme-Programming-Explained-Embrace-Change/dp/0321278658',
    likes: 9,
    __v: 0
  },
  {
    _id: '5a4230271b54a676234d24ff',
    title: 'Software Craftsmanship',
    author: 'Robert C. Martin',
    url: 'https://cleancoder.com/',
    likes: 11,
    __v: 0
  }
]

describe('most blogs', () => {

  test('works', () => {
    const result = listHelper.mostBlogs(testBlogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })

})

describe('most likes', () => {

  test('works', () => {
    const result = listHelper.mostLikes(testBlogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      likes: 33
    })
  })

})