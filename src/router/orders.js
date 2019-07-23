const express = require('express');
const router = new express.Router();

// Schema
const Order = require('../models/orders');

// auth middleware
const auth = require('../middleware/auth');



// -------------------------- Order routes -----------------------//

// Create Order - post request
router.post('/orders', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        owner: req.user._id
    });

    try {
        await order.save();
        res.status(201).send(order);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read order - Get request
router.get('/orders', auth, async (req, res) => {
    // to check who is accessing orders: admin/customer
    const query = req.user.admin ? {} : {
        owner: req.user._id
    };
    try {
        const orders = await Order.find(query);
        res.send(orders);


        // second approach - with populate method
        // await req.user.populate('orders').execPopulate();
        // res.send(req.user.orders);

    } catch (e) {
        res.status(400).send(e);
    }
});

// Read order by id - Get request
router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // checks if admin is making an update/delete ops to order, it will skip the auther checks as admin should be able update/delete order created by anyone
        const query = req.user.admin ? {
            _id,
        } : {
            _id,
            owner: req.user._id
        };
        const order = await Order.findOne(query);

        if (!order) {
            res.status(404).send();
        }
        res.send(order);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Find order by id and update - patch request
router.patch('/orders/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['kajuKatri', 'mohanThaal', 'kopraPak', 'anjeerRoll', 'fulvadi', 'chavanu', 'sonpapdi'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({
            error: 'Not valid updates'
        });
    }
    try {
        // checks if admin is making an update to order, it will skip the auther checks as admin should be able any order created by anyone
        const query = req.user.admin ? {
            _id: req.params.id,
        } : {
            _id: req.params.id,
            owner: req.user._id
        };
        const order = await Order.findOne(query);
        if (!order) {
            res.status(404).send();
        }
        updates.forEach(update => order[update] = req.body[update]);
        await order.save();
        res.status(200).send(order);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Find order by id and delete - delete request
router.delete('/orders/:id', auth, async (req, res) => {

    try {
        // checks if admin is making an update/delete ops to order, it will skip the auther checks as admin should be able update/delete order created by anyone
        const query = req.user.admin ? {
            _id: req.params.id,
        } : {
            _id: req.params.id,
            owner: req.user._id
        };
        const order = await Order.findOneAndDelete(query);
        if (!order) {
            return res.status(404).send({
                error: 'Invalid delete operation'
            });
        }
        res.send(order)

    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;