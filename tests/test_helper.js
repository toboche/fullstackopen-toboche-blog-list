const Blog = require('../models/blog')
const User = require('../models/user')

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

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb, 
  mapToNoIds, 
  usersInDb,
  newUser,
  saveNewUser
}