const Joi = require('joi');

const dbSchema = {
    set: Joi.object({
        name: Joi.string().required(),
        detail: Joi.string(),
        linkCrawl: Joi.object({
            link: Joi.string().required(),
            storeId: Joi.string().required(),
        }),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        intervalDuration: Joi.string().required(),
        createdBy: Joi.string().required(),
        updatedBy: Joi.string().required(),
        status: Joi.string().required()
    })
};

module.exports = dbSchema;