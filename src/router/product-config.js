const express = require('express');
const router = new express.Router();

// Schema
const Product = require('../models/product-config');

// auth middleware
const auth = require('../middleware/auth');

// file upload package
const multer = require('multer');

// Cropping image tool
const sharp = require('sharp');

// -------------------------- Product routes -----------------------//

// Upload Product - post request
router.post('/product-config', auth, async (req, res) => {
    if (!req.user.admin) {
        return res.status(404).send();
    }

    const product = new Product({
        ...req.body,
        owner: req.user._id
    });

    try {
        await product.save();
        res.status(201).send(product);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Multer Config
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

// upload product image - post request
router.post('/product-config/:productID', upload.single('productImage'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.productID);
        if (product) {
            const buffer = await sharp(req.file.buffer).resize({
                width: 400,
                height: 400
            }).png().toBuffer()
            product.productImage = buffer;
            await product.save();
            res.send(product);
        }
    } catch (e) {
        res.status(404).send(e);
    }
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});


// router get product
router.get('/product-config/:productID', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productID);
        if (!product) {
            throw new Error();
        }
        res.status(200).send(product);
    } catch (e) {
        res.status(404).send();
    }
});

// router get all product
router.get('/all-products',auth, async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products)
        res.status(200).send(products);
    } catch (e) {
        res.status(400).send()
    }

});

// find and update product by id - only admin
router.patch('/product-config/:productID', auth, async (req, res) => {
    if (!req.user.admin) {
        return res.status(404).send();
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ['productName', 'description', 'price'];

    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Not valid updates'});
    }
    try {
       const product = await Product.findById(req.params.productID);
       updates.forEach(update => product[update] = req.body[update]);
       await product.save();
       res.status(200).send(product) 
    } catch(e) {
        res.status(404).send();
    } 
})

// delete product by id - only admin
router.delete('/product-config/:productID', auth, async (req, res) => {
    if (!req.user.admin) {
        return res.status(404).send();
    }

    try {
        const product = await Product.findByIdAndDelete(req.params.productID);
        if (product) {
            res.status(200).send(product);
        } else {
            throw new Error()
        }
    } catch(e){
        res.status(404).send();
    }
})

module.exports = router;