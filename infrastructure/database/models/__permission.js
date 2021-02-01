const mongoose = require('mongoose');

const permission = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  resoure: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  }

});

module.exports = mongoose.model('permission', permission);
