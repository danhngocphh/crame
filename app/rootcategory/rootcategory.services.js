var { rootCategory: ModelRootCategory } = require('../../infrastructure/database/models');
const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const { APIError } = require('../../helpers');
const logger = require('../../infrastructure/logger');

exports.add = async (data) => {
    try{
        const { name, description, isRoot, createdBy, updatedBy } = data;
        const category = new ModelRootCategory(
            {
                name,
                description,
                isRoot,
                createdBy,
                updatedBy
            }
        );
        const add = await category.save(function (err) {
            if (err) {
                console.log(err)
                return null
            }
        })
        return category;
    } catch{
        return null;
    }
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

exports.deleteChild = async (data) => {
    try {
        const { idRootCategory, idChildCategory } = data;
        await ModelRootCategory.updateOne({ _id: idRootCategory }, {
            $pull: {
                childCategory: { _id: idChildCategory }
            }
        });
        return true
    } catch {
        return false
    }

};

exports.getById = (id) => {
    const rootCategory = ModelRootCategory.findById(id, function (err, category) {
        if (err) return null;
    }).exec();
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
        return { rootCategoryRecords, rest };
    } catch (error) {
        logger.error(error)
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
        _id: id,
        name,
        description,
        updatedBy
    } = data;
    const category = {
        name,
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
            return null
        };
    });
    return delRootCategory;
};

exports.remove = (data) => {
    try {
        const { id } = data;
        ModelRootCategory.findByIdAndRemove(id, function (err) {
            if (err) {
                logger.error(error)
            }
        })
        return true;
    } catch {
        logger.error(error)
        return false
    }
};