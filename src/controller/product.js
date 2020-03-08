const Product = require('../models/product');
const validator = require('./validator');
const normalizer = require('./normalizer');

exports.addProduct = (req, res, next) => {
  try {
    const productData = {
      ...req.body
    };
    // Data sanitization
    productData.productPrice = parseFloat(productData.productPrice).toFixed(2);
    productData.productDiscountedPrice = productData.productDiscountedPrice ? parseFloat(productData.productDiscountedPrice).toFixed(2) : '0.00';
    validator.productValidation(productData);
    // removes any white space except in beetwen words
    productData.productSizes = normalizer.productConfig(productData.productSizes);
    productData.productColors = normalizer.productConfig(productData.productColors);
    const product = new Product({
      ...productData,
      createdBy: req.user,
    });
    return product.save()
      .then((result) => {
        return res.status(201).send('Successfully created and submitted product for approval before start selling');
      })
      .catch(err => {
        return res.status(422).send('Please check all your inputs field again and follow rules!');
      })
  } catch (e) {
    if (e.message) {
      return res.status(422).send(e.message);
    }
    return res.status(400).send('Something went wrong on our server! Please try again!');
  };
};

exports.updateProduct = (req, res, next) => {
  try {
    const productData = {
      ...req.body
    };
    // Data sanitization
    productData.productPrice = parseFloat(productData.productPrice).toFixed(2);
    productData.productDiscountedPrice = productData.productDiscountedPrice ? parseFloat(productData.productDiscountedPrice).toFixed(2) : '0.00';
    if (!productData.productImage) {
      delete productData.productImage;
    }
    validator.productValidation(productData);
    // removes any white space except in beetwen words
    productData.productSizes = normalizer.productConfig(productData.productSizes);
    productData.productColors = normalizer.productConfig(productData.productColors);
    return Product.findOne({
        _id: req.params.productId,
        createdBy: req.user._id
      })
      .then(product => {
        if (!product) {
          return res.status(404).send('You are not allowed to make change to product that you don\'t own');
        }
        product.adminApproved = false;
        product.adminApprovalStatus = '';
        product.productName = productData.productName;
        product.productDescription = productData.productDescription;
        product.productSizes = productData.productSizes;
        product.productColors = productData.productColors;
        product.productPrice = productData.productPrice;
        product.productDiscountedPrice = productData.productDiscountedPrice;
        product.productCategory = productData.productCategory;
        product.productStock = productData.productStock;
        product.productWarnings = productData.productWarnings;
        product.productBuyingFrequency = productData.productBuyingFrequency;
        return product.save()
      })
      .then((result) => {
        return res.status(201).send('Successfully updates and submitted product for approval before start selling');
      })
      .catch(err => {
        return res.status(422).send('Please check all your inputs field again and follow rules!');
      })
  } catch (e) {
    if (e.message) {
      return res.status(422).send(e.message);
    }
    return res.status(400).send('Something went wrong on our server! Please try again!');
  };
}

exports.getMyProducts = (req, res, next) => {
  return Product.find({
      createdBy: req.user._id
    })
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(err => {
      return res.status(400).send('Something went wrong. Can not find your products');
    });
}

exports.getRequestedProduct = (req, res, next) => {
  if (req.params.productId) {
    return Product.findOne({
        createdBy: req.user._id,
        _id: req.params.productId
      })
      .select('-createdBy -like')
      .then(result => {
        result.productImage = '';
        return res.status(200).send(result);
      })
      .catch(err => {
        return res.status(400).send('Something went wrong. Can not find your products');
      });
  } else {
    res.status(401).send('You are not allowed to access requested resouce!');
  }
}