const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Promise.all(
        helper.initialBlogs
            .map((blogData) => new Blog(blogData))
            .map(blog => blog.save())
    )
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body.map(blog => {
        return {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes
          }
    }))
    .toContainEqual(helper.initialBlogs[0])
  })

  afterAll(() => {
    mongoose.connection.close()
  })