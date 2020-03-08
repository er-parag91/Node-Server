const express = require('express');
const router  = new express.Router();

// Auth middleware
const auth = require('../middleware/auth');

// Controller
const productController = require('../controller/product');

// POST Route - Add Product
router.post('/users/addProduct', auth, productController.addProduct);
router.post('/users/addProduct/:productId', auth, productController.updateProduct);
router.get('/users/getRequestedProduct/:productId', auth, productController.getRequestedProduct);
router.get('/users/getMyProducts', auth, productController.getMyProducts);

module.exports = router;