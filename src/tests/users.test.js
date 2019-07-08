const request = require('supertest');
const app = require('../app');

const User = require('../models/user');

const userOne = {
    name: 'Test',
    email: 'test@test.com',
    password: 'Test123!!'
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
})

test('should sign up the new user', async () => {
    await request(app).post('/users').send({
        name: 'Parag Patel',
        email: 'ppatel81@dev.com',
        password: 'Red123!!'
    }).expect(201);
})