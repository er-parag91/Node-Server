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

// test for signing up the user
test('should sign up the new user', async () => {
    await request(app).post('/users').send({
        name: 'Parag Patel',
        email: 'ppatel81@dev.com',
        password: 'Red123!!'
    }).expect(201);
});

// test for login the existing user
test('should log in the user', async () => {
    await request(app).post('/users/login').send({
        email: 'test@test.com',
        password: 'Test123!!'
    }).expect(200);
})

// test for not login the user with bad credentials
test('should not log in the user for bad credential', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisIsIncorrectPasswor!!'
    }).expect(400);
})