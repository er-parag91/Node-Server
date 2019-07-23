const mongoose = require('mongoose');


const orderItems = new mongoose.Schema({
    kajuKatri: {
        type: Number,
        default: 0,
        required: true,
    },
    anjeerRoll: {
        type: Number,
        default: 0,
        required: true,
    },
    kopraPak: {
        type: Number,
        default: 0,
        required: true,
    },
    mohanThaal: {
        type: Number,
        default: 0,
        required: true,
    },
    chavaanu: {
        type: Number
    },
    fulvadi: {
        type: Number
    },
    sonPapdi:{
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})


const Order = mongoose.model('Order', orderItems);

module.exports = Order;