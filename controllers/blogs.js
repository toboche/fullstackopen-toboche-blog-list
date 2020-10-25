const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
  
blogsRouter.post('/', async (request, response) => { 
  const body = request.body
  const user = await User.findById(body.userId)

  let blogData = request.body
  if(!request.body.likes){
    blogData = {
      ...blogData, 
      likes: 0
    }
  }
  if(!request.body.url || !request.body.title){
    return response.status(400).end()
  }
  blogData = {
    ...blogData,
    userId: user._id
  }

  const blog = new Blog(blogData)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const allBlogs =  await Blog.find({})
  response.status(201).json(allBlogs)
})

blogsRouter.delete('/:id', async (request, response) => {
  const idToDelete = request.params.id
  try{
    await Blog.deleteOne({_id: idToDelete})
  }catch (e){
    response.status(404).end()
  }
  response.status(200).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newLikes = request.body.likes
  if(!newLikes){
    return response.status(404).end()
  }
  const toUpdate = {likes: newLikes}

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, toUpdate, {new: true})
  console.log(updatedBlog);
  response.json(updatedBlog)
})

  module.exports = blogsRouter