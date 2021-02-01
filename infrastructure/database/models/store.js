const mongoose = require('mongoose');

const store = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // shopee_77 menFS
    // shopee_77
    category: [{
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        status: {
            type: Boolean,
            default: true,
        }
    }],
    url: {
        type: String,
        lowercase: true
    },
    imgLogo: {
        type: String,
        lowercase: true,
        require: true
    },
    status: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('store', store);