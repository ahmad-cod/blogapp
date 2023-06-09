const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const { resetDb, initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(resetDb, 30000)

describe('get blog', () => {
    test('should have 2 notes', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(initialBlogs.length)
    })
    
    test('each blog post has an id processed', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
        })
    })
})

describe('Add a blog', () => {
    let headers

    beforeEach(async () => {
        const newUser = {
            username: 'test',
            password: 'test'
        }
        await api
            .post('/api/users')
            .send(newUser)

        const result = await api
                        .post('/api/login')
                        .send(newUser)
        
        headers = {
            'Authorization': `Bearer ${result.body.token}`
        }
    })

    test('succeeds with a valid token', async () => {
        const blogsAtStart = await blogsInDb()
    
        const newBlog = {
            title: 'Test Blog',
            author: "Wahab Hellas",
            url: "https://www.google.com",
            likes: 1
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    
        const blogTitles = blogsAtEnd.map(b => b.title)
        expect(blogTitles).toContain('Test Blog')
    }, 30000)

    test.only('fails with an invalid token', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: "Wahab Hellas",
            url: "https://www.google.com",
            likes: 1
        }

        await api
            .post('/api/blogs')
            .set({'Authorization': 'Google'})
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    }, 30000)
})


test('should return 0 as default value for likes not defined in the request body', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: "Idowu Hellas",
        url: "https://www.google.com",
    }

    const response = await api.post('/api/blogs').send(newBlog)

    expect(response.body.likes).toBe(0)
})

test('should return the status code 400, if title or url is missing', async () => {
    const newBlog = {
        author: "Idowu Hellas",
        url: "https://www.google.com",
    }
    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.status).toBe(400)
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204, if id is valid', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const response = await api.delete(`/api/blogs/${blogToDelete.id}`)
        expect(response.status).toBe(204)

        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
        expect(blogsAtEnd).not.toContain(blogToDelete)
    })
})

describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToUpdate = blogsAtStart[0]
    
        const updatedBlog = {
            title: "Blog 1",
            author: "Idowu Hellas",
            url: "https://www.google.com",
            likes: 10 // set the value of likes to 10
        }
    
        const response = await api.put(`/api/blogs/${blogToUpdate.id}`, updatedBlog)
        console.log('PUT response:', response.body)
    
        const updatedBlogResponse = await api.get(`/api/blogs/${blogToUpdate.id}`)
        console.log('GET response:', updatedBlogResponse.body)
    
        expect(updatedBlogResponse.body.likes).toBe(updatedBlog.likes)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
}, 30000)