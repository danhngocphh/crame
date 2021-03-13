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
    urlCallAPI: {
        product: { type: String,  trim: true },
        category: { type: String,  trim: true }
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
    dataCrawlCategory:{
        categoryPath: { type: String,  trim: true },
        steps: [{
            name: { type: String,  trim: true },
            selector: { type: String,  trim: true }
        }]
    },
    dataCrawlProduct:{
        totalItem: { type: String,  trim: true },
        image: { type: String,  trim: true },
        name: { type: String,  trim: true },
        detail: { type: String,  trim: true },
        price: { type: String,  trim: true }
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('stores', store);