const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  productSizes: {
    type: String,
    trim: true,
    uppercase: true,
  },
  productColors: {
    type: String,
    trim: true,
    uppercase: true,
  },
  productPrice: {
    type: Number,
    required: true,
    trim: true,
  },
  productDiscountedPrice: {
    type: Number,
    trim: true,
  },
  productCategory: {
    type: String,
    required: true,
    trim: true,
  },
  productStock: {
    type: String,
    required: true,
  },
  productWarnings: {
    type: String,
    trim: true,
  },
  productBuyingFrequency: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    trim: true,
  },
  adminApproved: {
    type: String,
    default: 'Pending Approval'
  },
  adminApprovalStatus: {
    type: String,
    default: '',
    trim: '',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  }
});

const Product = mongoose.model('Product', productSchema);


module.exports = Product;