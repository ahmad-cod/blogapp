const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Blog 1",
        author: "Idowu Hellas",
        url: "https://www.google.com",
        likes: 1
    },
    {
        title: "7 Habits of highly successful people",
        author: "Steven Covey",
        url: "https://www.google.com",
        likes: 2
    }
]

const initialUsers = [
    {
        name: "Idowu Hellas",
        username: "idowu",
        password: "idowu"
    },
    {
        name: "Yusuf Mentor",
        username: "yusuf",
        password: "yusuf"
    }
]

const resetDb = async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
}
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const resetUsersDb = async () => {
    await User.deleteMany({})

    await User.insertMany(initialUsers)
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    initialUsers,
    resetUsersDb,
    blogsInDb,
    resetDb
}