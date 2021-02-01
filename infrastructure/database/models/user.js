const mongoose = require('mongoose');
const { role } = require('../enum');

const user = new mongoose.Schema({
  name: {
    first: String,
    last: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [role.admin, role.customer],
    default: role.customer
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('user', user);
