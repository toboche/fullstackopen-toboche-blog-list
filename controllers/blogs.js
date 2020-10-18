const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
  
blogsRouter.post('/', async (request, response) => { 
  let blogData = request.body
  if(!request.body.likes){
    blogData = {...blogData, likes: 0}
  }
  const blog = new Blog(blogData)

  await blog.save()
  const allBlogs =  await Blog.find({})
  response.status(201).json(allBlogs)
})

  module.exports = blogsRouter