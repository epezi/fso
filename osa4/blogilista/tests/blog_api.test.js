const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const loginResponse = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret'
      })
    
      token = loginResponse.body.token
})

describe('GET /api/blogs', () => {
    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs include an id field', async () => {
        const response = await api.get('/api/blogs')
        const count = response.body.filter(e => e.id !== undefined).length
        assert.strictEqual(count, response.body.length)
    })
})

describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'test',
            author: 'tester',
            url: 'test.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        
        const blogInDb = response.body.some(blog => 
            blog.title === newBlog.title &&
            blog.author === newBlog.author &&
            blog.url === newBlog.url &&
            blog.likes === newBlog.likes
        )
        
        assert.strictEqual(blogInDb, true)
    })

    test('adding a blog fails with status 401 if token is missing', async () => {
        const newBlog = {
            title: 'Unauthorized blog',
            author: 'No Token',
            url: 'unauthorized.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('if likes are missing, they default to 0', async () => {
        const newBlog = {
            title: 'test blog',
            author: 'tester',
            url: 'test.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)
    })

    test('if title or url is missing, return 400', async () => {
        const newBlog = {
            author: 'tester'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted successfully', async () => {
        
        const newBlog = {
            title: 'Test Blog',
            author: 'John Doe',
            url: 'http://example.com',
            likes: 5
          }
        
          const savedBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
        
          const blogToDelete = savedBlog.body

          const blogsAtStart = await helper.blogsInDb()
        
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const ids = blogsAtEnd.map(r => r.id)
        assert(!ids.includes(blogToDelete.id))
    })
})

describe('PUT /api/blogs/:id', () => {
    test('a blogs likes can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlogData = { 
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1 
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
    })
})

describe('when there is initially one user at db', () => {
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username or password is unvalid', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const badUsername = {
          username: 'ro',
          name: 'Superuser',
          password: 'salainen',
        }

        const badPassword = {
            username: 'badpass',
            name: 'Superuser',
            password: 'sa',
          }
    
        let result = await api
          .post('/api/users')
          .send(badUsername)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        let usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('is shorter than the minimum allowed length (3)'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        result = await api
          .post('/api/users')
          .send(badPassword)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password must be at least 3 characters long'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
