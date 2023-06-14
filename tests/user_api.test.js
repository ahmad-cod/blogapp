const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Creation of users', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('artos', 10)
        const user = new User({
            username: 'artos',
            passwordHash
        })
        
        await user.save()
    }, 30000)
    test('adding invalid users, should fail with correct status code and error message', async () => {
        const newUser = {
            username: 'artos',
            password: 'artos'
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(400)
    })
})