const mongoose = require('mongoose');

const rootcategory = new mongoose.Schema({
    // men_FS
    name: {
        type: String,
        required: true
    },
    //shopee_77
    //tiki_123/
    // parent : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref: "rootcategory"
    // },
    // childCategory: [{
    //     name: {
    //         type: String,
    //         required: true,
    //     },
    //     //["shopee","tiki",...]
    //     listId: [{
    //         name: String
    //     }],
    //     status: {
    //         type: Boolean,
    //         default: true
    //     }
    // }],
    // 
    childCategory: [{
        categoryId: Number,
        shopName: String
    }],
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('rootcategory', rootcategory);