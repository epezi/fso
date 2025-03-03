const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Test Blog 1',
        author: 'Tester One',
        url: 'test1.com',
        likes: 5
    },
    {
        title: 'Test Blog 2',
        author: 'Tester Two',
        url: 'test2.com',
        likes: 10
    },
    {
        title: 'Test Blog 3',
        author: 'Tester Three',
        url: 'test3.com',
        likes: 15
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}