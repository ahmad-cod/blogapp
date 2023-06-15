const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')

    next()
}

const extractUser = async (request, response, next) => { 
    // Extract bearer token from the request headers
    const { authorization } = request.headers

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken) {
            return response.status(401).send({ error: 'invalid token' })
        }

        // get user credentials frm the decoded token
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).send({ error: 'User not found' })
        }
        request.user = user
    } else {
        request.token = null
    }
    
    next()
}

const unknownEndpoint = (request, response) => {
    logger.error('unknown endpoint')
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
            return response.status(400).send({ error:'malformatted id' })
        } else if (error.name === 'ValidationError') {
            return response.status(400).send({ error: error.message })
        } else if (error.name === 'JsonWebTokenError') {
            return response.status(401).send({ error: error.message })
        }

    next(error)
}

module.exports = {
    requestLogger,
    extractUser,
    unknownEndpoint,
    errorHandler
}