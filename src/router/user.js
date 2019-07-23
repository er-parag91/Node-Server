const express = require('express');
const router  = new express.Router();

// Schema
const User = require('../models/user');

// Auth middleware
const auth = require('../middleware/auth');

// file upload package
const multer = require('multer');

// Cropping image tool
const sharp = require('sharp');

// sending out emails funtions
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

// -------------------------- User routes -----------------------//

// Create/Sign up user - post request
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
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
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];

    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Not valid updates'});
    }
    try {
        const user = req.user;

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
}) 

// Find user by id and delete - delete request
router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
        
    } catch (e) {
        res.status(500).send(e);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg or jpeg or png file only'));
        }
        cb(undefined, true);
    }
});

// upload profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// router get profile picture
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar);
    } catch(e) {
        res.status(404).send();
    }
});

// delete the profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});




module.exports = router;