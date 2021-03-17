const { rootCategory: ModelRootCategory } = require('../../infrastructure/database/models');
const ObjectID = require('mongodb').ObjectID;

exports.add = async (data) => {
    const { name, parent, description, createdBy, updatedBy } = data;
    const category = new ModelRootCategory(
        {
            name,
            parent: new ObjectID(parent),
            description,
            createdBy,
            updatedBy
        }
    );
    const add = await category.save(function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        }
        return add;
    })
};

exports.addChild = async (data) => {
    const { idroot, name, shopName, url, createdBy, updatedBy } = data;
    const childCategory = {
        name,
        shopName,
        url,
        createdBy,
        updatedBy
    };
    const addChild = await ModelRootCategory.updateOne({ _id: idroot }, { $push: { childCategory: childCategory } }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        }
        return addChild
    });
};

exports.deleteChild = (data) => {
    const { idRootCategory, idChildCategory } = data;
    ModelRootCategory.updateOne({ _id: idRootCategory }, {
        $pull: {
            childCategory: { _id: idChildCategory }
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true
    });
};

exports.get = (id) => {
    const category = ModelRootCategory.findById(id, function (err, category) {
        if (err) return next(err);
    })
    return category;
};

exports.getListRoot = async () => {
    ModelRootCategory.find({ parent: null }, function (err, categories) {
        var categoryMap = {};
        categories.forEach(function (category) {
            categoryMap[category._id] = category;
        });
        if (err) return next(err);
        return categoryMap;
    });
};

exports.getListParent = async (id) => {
    ModelRootCategory.find({ parent: new ObjectID(id) }, function (err, categories) {
        var categoryMap = {};
        categories.forEach(function (category) {
            categoryMap[category._id] = category;
        });
        if (err) return next(err);
        return categoryMap;
    });
};

exports.getListChild = async (id) => {
    const category = await ModelRootCategory.findById(id, function (err, category) {
        if (err) return next(err);
    })
    return category.childCategory;
};

exports.update = (data) => {
    const {
        name,
        parent,
        description,
        updatedBy
    } = data;
    const category = {
        name,
        parent,
        description,
        updatedBy
    };
    const editRootCategory = ModelRootCategory.findByIdAndUpdate(id, { $set: category }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
        return editRootCategory;
    });
};

exports.deleteItem = (data) => {
    const {
        id,
        updatedBy
    } = data;

    const editRootCategory = ModelRootCategory.findByIdAndUpdate(id, { $set: { isActive: false, updatedBy } }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
        return editRootCategory;
    });
};

exports.remove = (data) => {
    const { id } = data;
    ModelRootCategory.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true;
    })
};

