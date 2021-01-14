const mongoose = require('mongoose');

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
  isConfirmed: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('user', user);
