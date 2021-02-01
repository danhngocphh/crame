const mongoose = require('mongoose');

const cronjob = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    usercreatedid: {
        type: String,
        required: true
    },
    crawlconfigid: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true,
    },
    intervalduration: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('cronjob', cronjob);