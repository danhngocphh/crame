const Joi = require('joi');

const dbSchema = {
    product: Joi.object({
        data: Joi.array().required()
    })
};

module.exports = dbSchema;