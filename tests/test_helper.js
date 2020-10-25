const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const e = require('express')

const initialBlogs = [
  {
    title: "asd",
    author: "me",
    url: "www.google.com",
    likes: 123
  },
  {
    title: "wut",
    author: "him",
    url: "www.yahoo.com",
    likes: 1
  }
]

const newUser = {
  username: 'root',
  name: 'Superuser',
  passwordHash: 'salainen',
}

const anotherNewUser = {
  username: 'root2',
  name: 'Superuser2',
  passwordHash: 'salainen2',
}

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: "wut1",
    author: "him1",
    url: "www.yahoo1.com",
    likes: 11
    })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const mapToNoIds = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const saveNewUser = async () => {
  const userToSave = new User(newUser)
  return await userToSave.save()
}

const saveAnotherNewUser = async () => {
  const userToSave = new User(anotherNewUser)
  return await userToSave.save()
}

const getUserToken = async () => {
  const newSavedUser = await User.findOne({username: newUser.username})
  const userForToken = {
    username: newUser.username,
    id: newSavedUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

const getAnotherUserToken = async () => {
  const newSavedUser = await User.findOne({username: anotherNewUser.username})
  const userForToken = {
    username: anotherNewUser.username,
    id: newSavedUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb, 
  mapToNoIds, 
  usersInDb,
  newUser,
  anotherNewUser,
  saveNewUser,
  saveAnotherNewUser,
  getUserToken,
  getAnotherUserToken
}