const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new mongoose.Schema({
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
    required: true,
    unique: true,
  },
  image: String,
  name: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
  priceMin: Number,
  priceMax: Number,
  likes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

product.index({ name: 'text' });

module.exports = mongoose.model('product', product);
