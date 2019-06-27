const express = require('express');
const router  = new express.Router();

// Schema
const Task = require('../models/task');




// -------------------------- Task routes -----------------------//

// Create Task - post request
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read task - Get request
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Read task by id - Get request
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({ error: 'Not valid updates' });
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Find task by id and delete - delete request
router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send({ error: 'Invalid delete operation'});
        }
        res.status(200).send(task);
        
    } catch (e) {
        res.status(400).send(error);
    }
}) 


module.exports = router;