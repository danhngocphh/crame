const mongoose = require('mongoose');

const category = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  parentid: {
    type: Array
  },
  description: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('category', category);