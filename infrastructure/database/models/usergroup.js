const mongoose = require('mongoose');

const usergroup = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  roleid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isleadergroup: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('usergroup', usergroup);
