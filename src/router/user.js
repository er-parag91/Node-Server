const express = require('express');
const router  = new express.Router();

// Schema
const User = require('../models/user');

// -------------------------- User routes -----------------------//

// Create user - post request
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
})

// Read users - Get request
router.get('/users', async (req, res) => {

    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

// Read user by id - Get request
router.get('/users/:id', async (req, res) => {

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
router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Not valid updates'});
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id);

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
}) 

// Find user by id and delete - delete request
router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send({ error: 'Invalid delete operation'});
        }
        res.status(200).send(user);
        
    } catch (e) {
        res.status(400).send(error);
    }
});


module.exports = router;