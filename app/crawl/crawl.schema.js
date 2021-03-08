const Joi = require('joi');

const CrawlSchema = {
    apiProductPOST: Joi.object({
        storeId: Joi.string().required(),
        rootCategoryId: Joi.string().required(),
        categoryId: Joi.number().required(),
        limit: Joi.number().required(),
    }),
    crawlProductPOST: Joi.object({
        storeId: Joi.string().required(),
        rootCategoryId: Joi.string().required(),
        url: Joi.string().required()
    }),
    CategoryPOST: Joi.object({
        storeId: Joi.string().required()
    })
};

module.exports = CrawlSchema;