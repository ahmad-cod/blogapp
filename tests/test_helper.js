const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Blog 1",
        author: "Idowu Hellas",
        url: "https://www.google.com",
        likes: 1
    },
    {
        title: "Blog 2",
        author: "Idowu Hellas",
        url: "https://www.google.com",
        likes: 2
    }
]

const resetDb = async () => {
    await Blog.deleteMany({})
    let blog = new Blog(initialBlogs[0])
    await blog.save()
    blog = new Blog(initialBlogs[1])
    await blog.save()
}
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    resetDb
}