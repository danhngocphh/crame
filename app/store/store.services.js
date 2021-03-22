const { store: ModelStore } = require('../../infrastructure/database/models');

exports.add = async (data) => {
    const {
        name,
        baseUrl,
        category,
        urlCallAPI,
        headers,
        params,
        imgLogo,
        dataCallAPI,
        dataCrawlCategory,
        dataCrawlProduct,
        createdBy,
        updatedBy
    } = data;
    const store = new ModelStore(
        {
            name,
            baseUrl,
            category,
            urlCallAPI,
            headers,
            params,
            imgLogo,
            dataCallAPI,
            dataCrawlCategory,
            dataCrawlProduct,
            createdBy,
            updatedBy
        }
    );
    const add = await store.save(function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        }
    })
    return add;
};

exports.get = (id) => {
    const store = ModelStore.findById(id, function (err, category) {
        if (err) return next(err);
    }).exec()
    return store;
};

exports.update = (data) => {
    const {
        name,
        baseUrl,
        category,
        urlCallAPI,
        headers,
        params,
        imgLogo,
        dataCallAPI,
        dataCrawlCategory,
        dataCrawlProduct,
        updatedBy
    } = data;
    const store = new ModelStore(
        {
            name,
            baseUrl,
            category,
            urlCallAPI,
            headers,
            params,
            imgLogo,
            dataCallAPI,
            dataCrawlCategory,
            dataCrawlProduct,
            updatedBy
        }
    );
    const editStore = ModelStore.findByIdAndUpdate(id, { $set: store }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
    });
    return editStore;
};

exports.deleteItem = async (data) => {
    const {
        id,
        updatedBy
    } = data;

    const delStore = ModelStore.findByIdAndUpdate(id, { $set: { isActive: false, updatedBy } }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
    });
    return delStore;
};

exports.remove = (data) => {
    const { id } = data;
    ModelStore.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true;
    })
};
