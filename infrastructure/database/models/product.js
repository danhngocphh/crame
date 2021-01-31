const mongoose = require('mongoose');

const product = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  StoreId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  CategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Store.Category',
    required: true,
  },
  Slug: {
    type: String,
    required: true,
  },
  Url: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Updated: {
    type: Date,
    default: Date.now
  },
  Price: {
    type: Number,
    required: true,
  },
  PriceMin: Number,
  PriceMax: Number,
  Brand: String,
  Type: String,
  ProductCompare: String,
  Active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('product', product);