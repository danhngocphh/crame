const mongoose = require('mongoose');

const store = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Category: [{
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        Name: {
            type: String,
            required: true,
        },
        ParentId: {
            type: Array
        },
        Description: {
            type: String
        },
        Status: {
            type: String,
            required: true,
        }
    }],
    Url: {
        type: String,
        lowercase: true
    },
    ImgLogoUrl: {
        type: String,
        lowercase: true,
        require: true
    },
    Status: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('store', store);