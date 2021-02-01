const mongoose = require('mongoose');

const logcron = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    cronjobid: {
        type: String,
        required: true
    },
    logtime: {
        type: Date,
        required: true,
    },
    informationcontent: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('logcron', logcron);