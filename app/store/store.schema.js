const Joi = require('joi');

const dbSchema = {
    set: Joi.object({
        name: Joi.string().required(),
        baseUrl: Joi.string().required(),
        category: Joi.array(),
        urlCallAPI: Joi.object({
            product: Joi.string(),
            category: Joi.string(),
        }),
        headers: Joi.object(),
        params: Joi.object(),
        imgLogo: Joi.string(),
        dataCallAPI: Joi.object({
            urlHeader: Joi.string(),
            urlMiddle: Joi.string(),
            urlFooter: Joi.string(),
            urlProduct: Joi.string(),
            imageProduct: Joi.string(),
        }),
        dataCrawlCategory: Joi.object({
            categoryPath: Joi.string(),
            steps: Joi.array(),
        }),
        dataCrawlProduct: Joi.object({
            totalItem: Joi.string(),
            image: Joi.string(),
            name: Joi.string(),
            detail: Joi.string(),
            price: Joi.string(),
        }),
    })
};

module.exports = dbSchema;