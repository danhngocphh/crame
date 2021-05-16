const Joi = require('joi');
const { timeEnum } = require('../../infrastructure/database/enum');
const _ = require('lodash')

const dbSchema = {
    get: Joi.object({
        time: Joi.string().valid(..._.values(timeEnum)).required(),
        limit: Joi.number()
    })
};

module.exports = dbSchema;