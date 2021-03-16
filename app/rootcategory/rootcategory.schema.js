const Joi = require('joi');

const dbSchema = {
    category: Joi.object({
        storeName: Joi.string().required(),
        data: Joi.array().required()
    })
};

module.exports = dbSchema;