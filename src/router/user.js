const express = require('express');
const router  = new express.Router();

// Schema
const User = require('../models/user');

// Auth middleware
const auth = require('../middleware/auth');

// -------------------------- User routes -----------------------//

// Create/Sign up user - post request
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
})

// Read users - Get request
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// log in the user based on comparison method
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
})

// Log Out the user based on req.token supplied
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch(e){
        res.status(500).send();
    }
})

// Log out of all devices or clear the tokens object on the user
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
})


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