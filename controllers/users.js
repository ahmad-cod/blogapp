const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, likes: 1 })

    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if(password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true })
    
    if(user){
        response.json(user)
    } else {
        response.status(404).end()
    }
})

usersRouter.delete('/:id', async (request, response) => {
    const user = await User.findByIdAndDelete(request.params.id)
    
    response.status(204).end()
})

module.exports = usersRouter