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

exports.getById = (id) => {
    const store = ModelStore.findById(id, function (err, category) {
        if (err) return next(err);
    }).exec()
    return store;
};

exports.getListPaging = async (data) => {
    try {
        const {
            name: qName,
            paginateOptions
        } = data;
        const { docs: storeRecords, ...rest } = await ModelStore.paginate(
            {
                $and: [
                    qName ? { name:  qName } : {},
                    { isActive: true } 
                ],
            },
            paginateOptions
        );
        // const storeJson = storeRecords.toJSON();
        return { storeRecords, rest };
    } catch (error) {
        throw error;
    }
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

exports.remove = async (data) => {
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

