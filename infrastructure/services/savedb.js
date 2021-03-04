const { product: ModelProduct, store: ModelStore } = require('../database/models');

exports.product = (products) => {
    products.forEach(o => {
        ModelProduct.findOne({ remoteId: o.id }).then((result) => {
            if (!result) {
                let creatProducts = new ModelProduct(o);
                creatProducts.save();
            } 
        });
    });
};

exports.category = async (storeName ,category) => {
    await ModelStore.update({ name: storeName }, { $set: { category: category } }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return
        }
    });
};