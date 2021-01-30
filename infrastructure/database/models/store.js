const mongoose = require('mongoose');

const store = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        lowercase: true
    },
    imglogo: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('store', store);