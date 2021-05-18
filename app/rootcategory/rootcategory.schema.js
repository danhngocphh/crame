const Joi = require('joi');

const dbSchema = {
    add: Joi.object({
        name: Joi.string().required(),
        isRoot: Joi.boolean().required(),
        parentId: Joi.string(),
        description: Joi.string()
    }),
    update: Joi.object({
        name: Joi.string(),
        isRoot: Joi.boolean(),
        parentId: Joi.string(),
        description: Joi.string()
    }),
    addChildCategory: Joi.object({
        idRoot: Joi.string().required(),
        name: Joi.string().required(),
        shopName: Joi.string().required(),
        url: Joi.string().required()
    })
};

module.exports = dbSchema;