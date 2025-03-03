const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) =>
    (prev.likes > current.likes ? prev : current), 0)
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')
  const authorList = _.map(authorCounts, (count, author) => ({ author, blogs: count }))
  return _.maxBy(authorList, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorLikes = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))

  return _.maxBy(authorLikes, 'likes') || null
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs,mostLikes
}

