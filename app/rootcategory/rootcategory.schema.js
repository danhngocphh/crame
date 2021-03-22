const Joi = require('joi');

const dbSchema = {
    set: Joi.object({
        name: Joi.string().required(),
        parent: Joi.string().required(),
        description: Joi.string().required()
    }),
    delete: Joi.object({
        id: Joi.string().required()
    }),
    addChild: Joi.object({
        idRoot: Joi.string().required(),
        name: Joi.string().required(),
        shopName: Joi.string().required(),
        url: Joi.string().required()
    }),
    deleteChild: Joi.object({
        idRootCategory: Joi.string().required(),
        idChildCategory: Joi.string().required()
    })
};

module.exports = dbSchema;