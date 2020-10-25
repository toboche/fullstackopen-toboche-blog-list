const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { report } = require('../app')
const { response } = require('express')

beforeEach(async () => {
    await User.deleteMany({})
    const user = await helper.saveNewUser()
    const userId = user._id
    const anotherUser = await helper.saveAnotherNewUser()
    await Blog.deleteMany({})
    const blogsWithUser = helper.initialBlogs.map(blog => ({...blog, user: userId}))
    for (let blogData of blogsWithUser){
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
      const token = await helper.getUserToken()

      const newBlog = {
        title: "1 new title",
        author: "somebody",
        url: "www.asd.com",
        likes: 11
      }

      const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const currentBlogsInDb = await helper.blogsInDb()
      expect(currentBlogsInDb)
        .toHaveLength(helper.initialBlogs.length + 1)

      const {userId, ...expectedBlog} = newBlog
      expect(response.body.map(b => helper.mapToNoIds(b)))
        .toContainEqual(expectedBlog)
  })

  test('likes default to 0', async () => {
    const token = await helper.getUserToken()

    const newBlog = {
      title: "1 new title",
      author: "somebody",
      url: "www.asd.com",
    }

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const currentBlogsInDb = await helper.blogsInDb()
    expect(currentBlogsInDb)
      .toHaveLength(helper.initialBlogs.length + 1)

    const {userId, ...expectedBlog} = newBlog
    expect(response.body.map(b => helper.mapToNoIds(b)))
      .toContainEqual({...expectedBlog, likes: 0})
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
    const token = await helper.getUserToken()

    const idToDelete = '2342342aaa'

    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
  })

  test('no id to delete whatsoever', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs`)
        .expect(404)
  })

  test('deleting the first blog works with valid token', async () => {
    const token = await helper.getUserToken()
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
  
    const latestBlogsInDb = await helper.blogsInDb()
    expect(latestBlogsInDb)
        .toHaveLength(helper.initialBlogs.length - 1)
  })

  test('deleting doesnt work with no token', async () => {
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .expect(401)
  
    const latestBlogsInDb = await helper.blogsInDb()
    expect(latestBlogsInDb)
        .toHaveLength(helper.initialBlogs.length)
  })

  test('deleting the first blog doesnt work when not the same user as creator', async () => {
    const token = await helper.getAnotherUserToken()
    const blogsInDb = await helper.blogsInDb()
    const idToDelete = blogsInDb[0].id
    const response = await api.delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
  
    const latestBlogsInDb = await helper.blogsInDb()
    expect(latestBlogsInDb)
        .toHaveLength(helper.initialBlogs.length)
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

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
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

  afterAll(() => {
    mongoose.connection.close()
  })