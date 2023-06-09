const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (error) {
        console.error(error)
        response.status(500).send('Server Error')
    }
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(req.body)
    try {
        const result = await blog.save()
        response.json(result)
    } catch (error) {
        console.error(error)
    }
})

blogsRouter.put('/:id', async (request, response) => {

    try {
        const blog = await Blog.findByIdAndUpdate(request.params.id, req.body)
        response.json(blog)  
    } catch (error) {
        console.error(error)   
    }
})

blogsRouter.delete('/:id', async (request, response) => {

    try {
        const blog = await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end() 
    } catch (error) {
        console.error(error)
    }
})

module.exports = blogsRouter