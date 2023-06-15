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
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET_KEY)

    if(!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }
    const user = await User.findById(decodedToken.id)

    console.log('user', user)

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

    if(blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET_KEY)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }

    await blog.remove()

    response.status(204).end()
})

module.exports = blogsRouter