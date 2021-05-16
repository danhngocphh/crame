const mongoose = require('mongoose');

let keyword = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        lowercase: true
    },
    date : Date
});

module.exports = mongoose.model('keywords', keyword);