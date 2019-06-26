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
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
})

// Read users - Get request
app.get('/users', async (req, res) => {

    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

// Read user by id - Get request
app.get('/users/:id', async (req, res) => {

    const _id =  req.params.id;

    try{
        const user = await User.findById({_id: _id});

        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);         
    }
});


// Find user by id and update - patch request
app.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Not valid updates'});
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
}) 

// Find user by id and delete - delete request
app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(error);
    }
});



// -------------------------- Task routes -----------------------//

// Create Task - post request
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read task - Get request
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Read task by id - Get request
app.get('/tasks/:id', async (req, res) => {
    const _id =  req.params.id;

    try {
        const task = await Task.findById(_id);

        if (!task) {
            res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);         
    }
});

// Find task by id and update - patch request
app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({ error: 'Not valid updates' });
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Find task by id and delete - delete request
app.delete('/tasks/:id', (req, res) => {
    Task.findByIdAndDelete({ _id: req.params.id})
    .then((task) => {
        if (!task) {
            res.status(400).send('Error ocuured while deleting');
        }
        res.status(200).send(task);
    })
    .catch((error) => {
        res.status(500).send(error);
    })
}) 


// Listener
app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});