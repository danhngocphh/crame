const mongoose = require('mongoose');

const crawlconfig = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    storemapid: {
        type: String,
        required: true
    },
    categorymapid: {
        type: String,
        required: true
    },
    baseurl: {
        type: String,
        required: true
    },
    logourl: {
        type: String,
        required: true,
    },
    code_pattern: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    isvalid: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('crawlconfig', crawlconfig);