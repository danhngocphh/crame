const mongoose = require('mongoose');

const cronjob = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    detail: {
        type: String
    },
    // crawlConfigId: {
    //     type: String,
    //     required: true
    // },
    linkCrawl: [{
        link: {
            type: String,
            required: true
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "stores",
            required: true
        }
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
    },
    //intervalDuration: '00 30 11 * * 1-5'
    intervalDuration: {
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    updatedBy:{
        type: String
    },
    status: {
        type: String,
        enum: ["Crawling", "Cancel"],
        required: true
    },
    // type: {
    //     type: String,
    //     required: true
    // }
});

module.exports = mongoose.model('cronjob', cronjob);