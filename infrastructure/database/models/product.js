const mongoose = require('mongoose');

const product = new mongoose.Schema({
  storeid: {
    type: String,
    required: true,
  },
  categoryid: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pricemin:  Number,
  pricemax:  Number,
  brand: String,
  type: String,
  productcompare: String,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('product', product);