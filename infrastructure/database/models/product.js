const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new mongoose.Schema({
  remoteId: {
    type: String,
    required: true,
    unique: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'stores',
    required: true,
  },
  rootCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'rootcategories',
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
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
  detail: String,
  brand: String,
  type: String,
  productCompare: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('product', product);