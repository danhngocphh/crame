var { rootCategory: ModelRootCategory } = require('../../infrastructure/database/models');
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
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
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
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true
    });
};

exports.getById = (id) => {
    const rootCategory = ModelRootCategory.findById(id, function (err, category) {
        if (err) return next(err);
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
        const a = await ModelRootCategory
        .find({isActive: true, isRoot: true}).populate({
            
            // Get friends of friends - populate the 'friends' array for every friend
            populate: [{ path: 'parent' }],
            path: 'parent',
        });

        return a;
    } catch (error) {
        console.log(error);
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
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true;
    })
};

function autoPopulateSubs(next) {
    this.populate('parent');
    next();
}

