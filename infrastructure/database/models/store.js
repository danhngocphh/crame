const mongoose = require('mongoose');

const store = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    baseUrl: {
        type: String,
        required: true,
        unique: true
    },
    category: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    }],
    imgLogo: {
        type: String,
        require: true
    },
    createdBy:{
        type: String
    },
    updatedBy:{
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('stores', store);