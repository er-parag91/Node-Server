const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'Test',
    email: 'test@test.com',
    password: 'Test123!!',
    tokens: [{
        token: jwt.sign({_id:userOneID}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
})

// test for signing up the user
test('should sign up the new user', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Parag Patel',
            email: 'ppatel81@dev.com',
            password: 'Red123!!'
        }).expect(201);
});

// test for login the existing user
test('should log in the user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'test@test.com',
            password: 'Test123!!'
        }).expect(200);
})

// test for not login the user with bad credentials
test('should not log in the user for bad credential', async () => {
    await request(app)
        .post('/users/login').
        send({
            email: userOne.email,
            password: 'thisIsIncorrectPasswor!!'
        }).expect(400);
})

// read or get user profile with setting up headers(token)
test('should get the user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

// should not get user profile if unauthenticated or token is not set
test('should not get user profile if unauthenticated or token is not set', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})

// delete account operation works if user is authenticate
test('should delete the user account if user is authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

// delete account operation does not work if user is unauthenticate
test('should not delete the user account if user is  not authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})

// -------------------- Advanced Assertion ----------------//
// test for signing up the user
test('should have added the new user to database', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Parag Patel',
            email: 'ppatel81@dev.com',
            password: 'Red123!!'
        }).expect(201);
    
    // assert about database was changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assert about response
    expect(response.body).toMatchObject({
        user: {
            name: 'Parag Patel',
            email: 'ppatel81@dev.com'
        },
        token: user.tokens[0].token
    });

    // assert about plain text password is not saved
    expect(user.password).not.toBe('Red123!!');
});

// test for token is saved when user logs in
test('should save token on logging in the user', async () => {
   const response = await request(app)
        .post('/users/login')
        .send({
            email: 'test@test.com',
            password: 'Test123!!'
        }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

// delete account operation works and that user should not be in database anymore
test('should remove the user account from database if user is authenticated', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    
    const user = await User.findById(userOneID);
    expect(user).toBeNull();
})
