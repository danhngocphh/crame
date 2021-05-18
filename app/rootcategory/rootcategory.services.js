var { rootCategory: ModelRootCategory } = require('../../infrastructure/database/models');
const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const { APIError } = require('../../helpers');
const logger = require('../../infrastructure/logger');

exports.add = async (data) => {
    try {
        const { name, description, parentId, isRoot, createdBy, updatedBy } = data;
        const category = new ModelRootCategory(
            {
                name,
                description,
                isRoot,
                createdBy,
                updatedBy
            }
        );
        await category.save(function (err) {
            if (err) {
                throw new APIError('Cant add rootCategory', config.httpStatus.BadRequest, {
                    Message: err,
                });
            }
        });
        if (parentId) {
            let getRootCategory = await ModelRootCategory.findById(parentId, function (err, category) {
                if (err) {
                    throw new APIError('Cant find rootCategory to add parentId', config.httpStatus.BadRequest, {
                        Message: err,
                    });
                };
            }).exec();
            if (getRootCategory) {
                getRootCategory.listChild.push(category._id);
                getRootCategory.save();
            }
        }
        return category;
    } catch {
        throw new APIError('Cant add rootCategory', config.httpStatus.BadRequest, {
            Message: `Try again`,
        });
    }
};

exports.addChild = async (data) => {
    try {
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
                throw new APIError('Cant addChild rootCategory', config.httpStatus.BadRequest, {
                    message: err,
                });
            }
        });
        return addChild.toJSON()
    } catch (err) {
        throw new APIError('Cant add rootCategory', config.httpStatus.BadRequest, {
            message: err,
        });
    }
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
        throw new APIError('Cant deleteChild rootCategory', config.httpStatus.BadRequest, {
            message: err,
        });
    }

};

exports.getById = async (id) => {
    try {
        const rootCategory = await ModelRootCategory.findById(id, function (err, category) {
            if (err) {
                throw new APIError('Cant getById rootCategory', config.httpStatus.BadRequest, {
                    message: err,
                });
            };
        }).exec();
        return rootCategory.toJSON();
    } catch (err) {
        throw new APIError('Cant getById rootCategory', config.httpStatus.BadRequest, {
            message: err,
        });
    }
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
        const rootCategoryJSON = rootCategoryRecords.toJSON();
        return { rootCategoryJSON, rest };
    } catch (error) {
        throw new APIError('Cant getListPaging rootCategory', config.httpStatus.BadRequest, {
            message: error,
        });
    }
};

exports.megaMenu = async () => {
    try {
        const megaMenu = await ModelRootCategory
            .find({ isActive: true, isRoot: true }).populate({
                path: 'listChild',
                match: { isActive: true },
                populate: [{ path: 'listChild' }],
            });
        return megaMenu;
    } catch (error) {
        throw new APIError('Cant get megaMenu rootCategory', config.httpStatus.BadRequest, {
            message: error,
        });
    }
};

exports.update = async (data) => {
    try {
        const {
            id,
            name,
            description,
            isRoot,
            updatedBy
        } = data;
        const category = {
            name,
            description,
            isRoot,
            updatedBy
        };
        const editRootCategory = await ModelRootCategory.findByIdAndUpdate(id, { $set: category }, function (err, category) {
            if (err) {
                throw new APIError('Cant update rootCategory', config.httpStatus.BadRequest, {
                    message: err,
                });
            };
        }).exec();
        return editRootCategory.toJSON();
    } catch (error) {
        throw new APIError('Cant update rootCategory', config.httpStatus.BadRequest, {
            message: error,
        });
    }
};

exports.deleteItem = async (data) => {
    try {
        const {
            id,
            updatedBy
        } = data;
        const delRootCategory = await ModelRootCategory.findByIdAndUpdate(id, { $set: { isActive: false, updatedBy } }, function (err, category) {
            if (err) {
                throw new APIError('Cant deleteItem rootCategory', config.httpStatus.BadRequest, {
                    message: err,
                });
            };
        }).exec();
        return delRootCategory.toJSON();
    } catch (error) {
        throw new APIError('Cant deleteItem rootCategory', config.httpStatus.BadRequest, {
            message: error,
        });
    }
};

exports.remove = async (data) => {
    try {
        const { id } = data;
        const removeRootCategory = await ModelRootCategory.findByIdAndRemove(id, function (err) {
            if (err) {
                throw new APIError('Cant remove rootCategory', config.httpStatus.BadRequest, {
                    message: error,
                });
            }
        }).exec()
        return removeRootCategory.toJSON();
    } catch (error) {
        throw new APIError('Cant remove rootCategory', config.httpStatus.BadRequest, {
            message: error,
        });
    }
};