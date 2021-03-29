var { rootCategory: ModelRootCategory } = require('../../infrastructure/database/models');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../infrastructure/logger');

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
            return null
        }
    })
    return add;
};

exports.addChild = async (data) => {
    const { idRoot, name, shopName, url, createdBy, updatedBy } = data;
    const childCategory = {
        name,
        shopName,
        url,
        createdBy,
        updatedBy
    };
    const addChild = await ModelRootCategory.updateOne({ _id: idRoot }, { $push: { childCategory: childCategory } }, (err, result) => {
        if (err) {
            return null
        }
    });
    return addChild
};

exports.deleteChild = (data) => {
    const { idRootCategory, idChildCategory } = data;
    ModelRootCategory.updateOne({ _id: idRootCategory }, {
        $pull: {
            childCategory: { _id: idChildCategory }
        }
    }, (err, result) => {
        if (err) {
            return false
        }
        return true
    });
};

exports.getById = (id) => {
    const rootCategory = ModelRootCategory.findById(id, function (err, category) {
        if (err) return null;
    })
    return rootCategory;
};


exports.getListPaging = async (data) => {
    try {
        const {
            parent: qParent,
            name: qName,
            paginateOptions
        } = data;
        const { docs: rootCategoryRecords, ...rest } = await ModelRootCategory.paginate(
            {
                $and: [
                    qParent ? { parent: new ObjectID(qParent) } : {},
                    qName ? { name: qName } : {},
                    { isActive: true }
                ],
            },
            paginateOptions
        );
        const rootCategoryJson = rootCategoryRecords.toJson();
        return { rootCategoryJson, rest };
    } catch (error) {
        next(error);
    }
};

exports.megaMenu = async () => {
    try {
        const megaMenu = await ModelRootCategory
            .find({ isActive: true, isRoot: true }).populate({
                path: 'parent',
                match: { isActive: true },
                populate: [{ path: 'parent' }],
            });
        return megaMenu;
    } catch (error) {
        logger.error(error)
    }
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
    });
    return editRootCategory;
};

exports.deleteItem = (data) => {
    const {
        id,
        updatedBy
    } = data;

    const delRootCategory = ModelRootCategory.findByIdAndUpdate(id, { $set: { isActive: false, updatedBy } }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
    });
    return delRootCategory;
};

exports.remove = (data) => {
    const { id } = data;
    ModelRootCategory.findByIdAndRemove(id, function (err) {
        if (err) {
            return false
        }
        return true;
    })
};