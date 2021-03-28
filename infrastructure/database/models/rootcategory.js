const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

let rootcategory = new mongoose.Schema({
    // men_FS
    name: {
        type: String,
        unique: true
    },
    parent : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "rootcategories",
        
    }], 
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
    isRoot: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

rootcategory.plugin(deepPopulate)




module.exports = mongoose.model('rootcategories', rootcategory);