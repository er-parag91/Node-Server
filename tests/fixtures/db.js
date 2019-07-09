const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');


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

const setupDatabase = async() => {
    await User.deleteMany();
    await new User(userOne).save();
}

module.exports = {
    userOneID,
    userOne,
    setupDatabase
}