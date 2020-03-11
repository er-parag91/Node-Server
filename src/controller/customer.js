const Product = require('../models/product');


exports.getProductsByCategory = (req, res, next) => {
  return Product.find({
      productCategory: req.params.category
    })
    .populate('createdBy', 'firstName lastName')
    .select('-adminApproved -adminApprovalStatus -productDescription -productSizes -productColors -productWarnings -productBuyingFrequency')
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send('Something went wrong. Can not find requested products!');
    })
};

exports.customerLikedProduct = (req, res, next) => {
  const productId = req.params.productId;
  return Product.findById(productId)
    .populate('createdBy', 'firstName lastName')
    .select('-adminApproved -adminApprovalStatus -productDescription -productWarnings -productBuyingFrequency')
    .then(product => {
      if (product.createdBy.toString() === req.user._id.toString()) {
        throw new Error('You are not allowed to upvote your own product.');
      }
      product.like += 1;
      return product.save();
    })
    .then(result => {
      if (!result) {
        throw new Error('We could not process your product \'Like\' action');
      }
      console.log(result);
      res.status(200).send();
    })
    .catch(e => {
      return res.status(400).send(e.message ? e.message : 'Something went wrong. we could not process your product \'Like\' action.');
    });
};

exports.addToCart = (req, res, next) => {
  const productId = req.params.productId;
  return Product.findById(productId)
    .then(product => {
      if (!product) {
        throw new Error('You tried to add not existent product to cart')
      }
      const userCartItems = req.user.cart.items;
      const cartItemIndex = userCartItems.findIndex((item, i) => {
        return item.productId.toString() === product._id.toString()
      });
      if (cartItemIndex >= 0) {
        userCartItems[cartItemIndex].quantity += 1;
      } else {
        userCartItems.push({
          productId: product._id,
          quantity: 1,
        })
      }
      const updatedCart = {
        items: userCartItems,
      }
      req.user.cart = updatedCart;
      return req.user.save()
    })
    .then(result => {
      let cartQuantity = 0;
      result.cart.items.forEach(item => cartQuantity += item.quantity);
      return res.status(200).send({
        message: 'Added to Cart',
        cartQuantity
      });
    })
    .catch(e => {
      return res.status(400).send(e.message ? e.message : 'Error while adding to cart.');
    })
}