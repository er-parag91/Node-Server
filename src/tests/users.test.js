const request = require('supertest');
const app = require('../app');

const User = require('../models/user');

beforeEach(async () => {
    await User.deleteMany();
})

test('should sign up the new user', async () => {
    await request(app).post('/users').send({
        name: 'Parag Patel',
        email: 'ppatel81@dev.com',
        password: 'Red123!!'
    }).expect(201);
})