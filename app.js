require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')

const mongoUrl = process.env.MONGODB_URI
console.log('connecting to', mongoUrl)

mongoose.connect(mongoUrl)
    .then(() => console.log('connected to database'))
    .catch(err => console.error('error connecting to database', err))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app