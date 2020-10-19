const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const { report } = require('../app')
const { response } = require('express')

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blogData of helper.initialBlogs){
        let blog = new Blog(blogData)
        await blog.save()
    }
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

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const currentBlogsInDb = await helper.blogsInDb()
      expect(currentBlogsInDb)
        .toHaveLength(helper.initialBlogs.length + 1)

      expect(response.body.map(b => helper.mapToNoIds(b)))
        .toContainEqual(newBlog)
  })

  test('likes default to 0', async () => {
    const newBlog = {
      title: "1 new title",
      author: "somebody",
      url: "www.asd.com"
    }

    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const currentBlogsInDb = await helper.blogsInDb()
    expect(currentBlogsInDb)
      .toHaveLength(helper.initialBlogs.length + 1)

    expect(response.body.map(b => helper.mapToNoIds(b)))
      .toContainEqual({...newBlog, likes: 0})
})

test('no title results in 400 when posting', async () => {
    const newBlog = {
      author: "somebody",
      url: "www.asd.com",
      likes: 0
    }

    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
})

test('no url results in 400 when posting', async () => {
    const newBlog = {
      title: "asdasda",
      author: "somebody",
      likes: 0
    }

    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
})

describe('delete tests', () => {
  test('inexisting id', async () => {
    const idToDelete = '2342342aaa'

    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .expect(404)
  })

  test('no id to delete whatsoever', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs`)
        .expect(404)
  })

  test('deleting the first blog works', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .expect(200)
  
    const latestBlogsInDb = await helper.blogsInDb()
    expect(latestBlogsInDb)
        .toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('update tests', () => {
  test('updating exiting works', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const expectedLikes = 333
    const response = await api.put(`/api/blogs/${idToDelete}`)
        .send({likes: expectedLikes})
        .expect(200)
  
    const latestBlogsInDb = await helper.blogsInDb()
    expect(latestBlogsInDb[0].likes)
        .toEqual(expectedLikes)
  })

  test('updating exiting fails when no likes', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.put(`/api/blogs/${idToDelete}`)
        .send({})
        .expect(404)
  })
})

  afterAll(() => {
    mongoose.connection.close()
  })