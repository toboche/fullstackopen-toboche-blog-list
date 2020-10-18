const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const { report } = require('../app')

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
  
  test('the first blog is as expected', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
  
    expect(response.body.map(b => helper.mapToNoIds(b)))
        .toContainEqual(helper.initialBlogs[0])
  })

  test('the first blog is as expected when using id', async () => {
    const currentBlogs = await helper.blogsInDb()
    const id = currentBlogs[0].id
    const response = await api.get(`/api/blogs/${id}`)
        .expect(200)
    
    expect(response.body.id).toBeDefined()
    const mappedBlog = helper.mapToNoIds(response.body)
    expect(mappedBlog)
        .toEqual(helper.initialBlogs[0])
  })

  test('a valid blog can be added', async () => {
      const newBlog = {
        title: "1 new title",
        author: "somebody",
        url: "www.asd.com",
        likes: 11
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const currentBlogsInDb = await helper.blogsInDb()
      expect(currentBlogsInDb)
        .toHaveLength(helper.initialBlogs.length + 1)
  })

  afterAll(() => {
    mongoose.connection.close()
  })