const mongoose = require('mongoose');
const { regex } = require('../../../config');
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
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return regex.phoneNumber.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  avatarUrl : String,
  birthday: Date,
  address: String,
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

module.exports = mongoose.model('users', user);
