const Joi = require('joi');

const dbSchema = {
    createOne: Joi.object({
        storeId: Joi.string().required(),
        remoteId: Joi.string().required(),
        rootCategoryId: Joi.string().required(),
        url: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.string().required(),
    }),
    updateOne: Joi.object({
        storeId: Joi.string().required(),
        rootCategoryId: Joi.string().required(),
        url: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.string().required(),
    }),
    createMultiple:Joi.object({
        products: Joi.array()
        .items({
            storeId: Joi.string().required(),
            remoteId: Joi.string().required(),
            rootCategoryId: Joi.string().required(),
            url: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.string().required(),
        }),
    }),
    updateMultiple:Joi.object({
        products: Joi.array()
        .items({
            id: Joi.string().required(),
            storeId: Joi.string().required(),
            rootCategoryId: Joi.string().required(),
            url: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.string().required(),
        }),
    }),
    deleteMultiple:Joi.object({
        ids: Joi.array().required()
    }),
};

module.exports = dbSchema;