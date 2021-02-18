const mongoose = require('mongoose');

const store = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // shopee_77 menFS
    // shopee_77
    category: [{
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    }],
    url: {
        type: Object,
        required: true
    },
    headers: {
        type: Object,
        required: true

    },
    params: {
        type: Object,
        required: true

    },
    imgLogo: {
        type: String,
        lowercase: true,
        require: true
    },
    dataCallAPI:{
        urlHeader: { type: String,  trim: true },
        urlMiddle: { type: String,  trim: true },
        urlFooter: { type: String,  trim: true },
        urlProduct: { type: String,  trim: true },
        imageProduct:{ type: String,  trim: true }
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('stores', store);