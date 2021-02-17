const Joi = require('joi');

const CrawlSchema = {
    apiProductPOST: Joi.object({
        storeName: Joi.string().required(),
        nameRootCategory: Joi.string().required(),
        categoryId: Joi.number().required(),
        limit: Joi.number().required(),
    })
};

module.exports = CrawlSchema;