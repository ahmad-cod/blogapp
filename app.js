const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const { requestLogger, extractUser, unknownEndpoint, errorHandler } = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { bufferTimeoutMS: 30000 })
    .then(() => logger.info('connected to database'))
    .catch(err => logger.error('error connecting to database', err))

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(requestLogger)

app.use('/api/blogs', extractUser, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app