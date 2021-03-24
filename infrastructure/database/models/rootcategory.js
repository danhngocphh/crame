const mongoose = require('mongoose');

const rootcategory = new mongoose.Schema({
    // men_FS
    name: {
        type: String,
        unique: true
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "rootcategory"
    }, 
    childCategory: [{
        name: String,
        shopName: String,
        url: String,
        createdBy: String,
        updatedBy: String
    }],
    description: {
        type: String
    },
    createdBy:{
        type: String,
        required: true
    },
    updatedBy:{
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('rootcategories', rootcategory);