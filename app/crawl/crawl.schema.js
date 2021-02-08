const Joi = require('joi');

const CrawlSchema = {
    apiProductPOST: Joi.object({
        storename: Joi.string().required(),
        namerootcategory: Joi.string().required(),
        categoryid: Joi.number().required(),
        limit: Joi.number().required(),
    })
};

module.exports = CrawlSchema;