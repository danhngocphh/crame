const mongoose = require('mongoose');

const role = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  permissionid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('role', role);