const mongoose = require('mongoose');


const orderItems = new mongoose.Schema({
    kajuKatri: {
        type: Number
    },
    anjeerRoll: {
        type: Number
    },
    kopraPak: {
        type: Number
    },
    mohanThaal: {
        type: Number
    },
    chavaanu: {
        type: Number
    },
    fulvadi: {
        type: Number
    },
    sonPapdi: {
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