const express = require('express');
const router  = new express.Router();

// Auth middleware
const auth = require('../middleware/auth');

// Controller
const customerController = require('../controller/customer');

router.get('/customer/customerProducts/:category', auth, customerController.getProductsByCategory);
router.post('/customer/customerProducts/customerLikedProduct/:productId', auth, customerController.customerLikedProduct);
router.post('/customer/customerProducts/addToCart/:productId', auth, customerController.addToCart);

module.exports = router;