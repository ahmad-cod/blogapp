const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')

    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    try {
      const user = request.user
      if (!user) {
        return response.status(401).json({ error: 'Not logged in' })
      }
  
      const { title, author, url, likes = 0 } = request.body
  
      const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user.id,
      })
  
      const savedBlog = await blog.save();
      const populatedBlog = await Blog.findById(savedBlog.id).populate('user')
  
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
  
      response.status(201).json(populatedBlog)
    } catch (error) {
      response.status(500).json({ error: 'An error occurred' })
    }
  });
  

blogsRouter.put('/:id', async (request, response) => {
  const { likes, comments } = request.body
  const updates = {}
  if(likes) {
    updates.likes = likes
  }
  if(comments) {
    updates.comments = comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updates, { new: true })

  if(updatedBlog) {
      response.json(updatedBlog)
  } else {
      response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== user.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }

    await Blog.deleteOne({ _id: blog.id })

    response.status(204).end()
})

module.exports = blogsRouter