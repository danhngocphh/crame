const Joi = require('joi');

const dbSchema = {
    add: Joi.object({
        name: Joi.string().required(),
        isRoot: Joi.boolean().required(),
        description: Joi.string()
    }),
    update: Joi.object({
        name: Joi.string().required(),
        listChild: Joi.array(),
        childCategory: Joi.array(),
        isRoot: Joi.boolean().required(),
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