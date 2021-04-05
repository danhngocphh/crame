const Joi = require('joi');

const CrawlSchema = {
    scrapeCategoryPOST: Joi.object({
        url: Joi.string().uri().required(),
        selector: Joi.string().required(),
    }),
    scrapeProductPOST: Joi.object({
        url: Joi.string().uri().required(),
        selector: Joi.string().required(),
        doAutoScroll: Joi.boolean(),
    }),
    scrapeDetailProductPOST: Joi.object({
        url: Joi.string().uri().required(),
        selectorName: Joi.string().required(),
        selectorImage: Joi.string().required(),
        selectorPrice: Joi.string().required(),
    }),
};

module.exports = CrawlSchema;