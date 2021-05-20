const mongoose = require('mongoose');

let link = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        lowercase: true
    },
    date : Date
});

module.exports = mongoose.model('links', link);