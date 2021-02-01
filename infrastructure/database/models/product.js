const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new mongoose.Schema({
  remoteId: {
    type: String,
    required: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'store',
    required: true,
  },
  rootCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'rootCategory',
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true,
  },
  priceMin: Number,
  priceMax: Number,
  brand: String,
  type: String,
  productCompare: String,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('product', product);