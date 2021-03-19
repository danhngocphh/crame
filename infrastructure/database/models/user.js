const mongoose = require('mongoose');
const { regex, email: emailConfig } = require('../../../config');
const { roleEnum } = require('../enum');

const user = new mongoose.Schema({
  name: {
    full: {
      type: String,
      default: function () {
        return `${this.name.first} ${this.name.last}`
      }
    },
    first: String,
    last: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v !== emailConfig.user;
      },
      message: props => `${props.value} is not a valid!`
    }
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
  avatarPublicId : String,
  birthday: Date,
  address: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roleEnum.admin, roleEnum.customer],
    default: roleEnum.customer
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  hasChangePassword: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('users', user);
