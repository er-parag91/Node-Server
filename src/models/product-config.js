const mongoose = require('mongoose');


const product = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: Buffer
    }
}, {
    timestamps: true
})


const Product = mongoose.model('product', product);

module.exports = Product;