const { product: ModelProduct, store: ModelStore } = require('../database/models');
const _ = require('lodash');


exports.product = (_products) => {
    _products.forEach(o => {
        ModelProduct.findOne({ remoteId: o.id }).then((result) => {
            if (!result) {
                let _creatProducts = new ModelProduct(o);
                _creatProducts.save();
            } 
        });
    });
};

exports.category = async (storeName ,_category) => {
    await ModelStore.update({ name: storeName }, { $set: { category: _category } }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return
        }
    });
};