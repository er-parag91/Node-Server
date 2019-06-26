const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        validate(value){
            if (value < 0) {
                throw new Error('Age must be positive integer');
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    }
});

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    }
});


 const Me = new User({
     name: 'Pragnesh',
     age: 27,
     email: 'pragnesh2559@gmail.com'
 })

 Me.save().then(() => {
     console.log(Me)
 }, (error) => {
     console.log(error)
 })