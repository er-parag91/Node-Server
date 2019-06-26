const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const Me = new User({
    name: 'Parag',
    age: 26
})

Me.save().then(me => {
    console.log(me)
}, (error) => {
    console.log(error)
})