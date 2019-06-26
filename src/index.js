const express = require('express');
require('./db/mongoose');

// Schema
const User = require('./models/user');
const Task = require('./models/task');

// express config
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


// -------------------------- User routes -----------------------//

// Create user - post request
app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save()
        .then((user) => {
            res.status(201).send(user);
        })
        .catch((error) => {
            res.status(400).send(error);
        })
})

// Read users - Get request
app.get('/users', (req, res) => {
    User.find({})
        .then(users => {
            res.status(200).send(users);
        })
        .catch(error => {
            console.log(error);
        })
});


// -------------------------- Task routes -----------------------//

// Create Task - post request
app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save()
        .then((task) => {
            res.status(201).send(task);
        })
        .catch((error) => {
            res.status(400).send(error);
        })

})

// Read task - Get request
app.get('/tasks', (req, res) => {
    Task.find({})
        .then(tasks => {
            res.status(200).send(tasks);
        })
        .catch(error => {
            console.log(error);
        })
});


// Listener
app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});