const Joi = require('joi');

const dbSchema = {
    set: Joi.object({
        items: Joi.array().required()
    }),
    get: Joi.object({
        items: Joi.array().required()
    })
};

module.exports = dbSchema;