const { product: ModelProduct } = require('../database/models');
const _ = require('lodash');


exports.product = (_products) => {
    _products.forEach(o => {
        ModelProduct.findOne({ idremoteId: o.id }).then((result) => {
            if (!result) {
                let _creatProducts = new ModelProduct(o);
                _creatProducts.save();
            } 
        });
    });
};