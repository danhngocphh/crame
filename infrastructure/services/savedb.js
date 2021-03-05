const { product: ModelProduct, store: ModelStore } = require('../database/models');

exports.addProduct = (products) => {
    products.forEach(o => {
        ModelProduct.findOne({ remoteId: o.id }).then((result) => {
            if (!result) {
                let creatProducts = new ModelProduct(o);
                creatProducts.save();
                return true
            }else{
                return false
            }
        });
    });
};

exports.setCategory = async (storeName ,category) => {
    await ModelStore.updateOne({ name: storeName }, { $set: { category: category } }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true
    });
};

exports.addCategory = async (storeName ,category) => {
    await ModelStore.updateOne({ name: storeName }, { $push: { category: category } }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true
    });
};