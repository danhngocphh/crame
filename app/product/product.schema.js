const Joi = require('joi');

const dbSchema = {
  createOne: Joi.object({
    storeId: Joi.string().required(),
    remoteId: Joi.string().required(),
    rootCategoryId: Joi.string().required(),
    url: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.string().required(),
  }),
  updateOne: Joi.object({
    storeId: Joi.string().required(),
    rootCategoryId: Joi.string().required(),
    url: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.string().required(),
  }),
  createMultiple: Joi.object({
    products: Joi.array().items({
      storeId: Joi.string().required(),
      rootCategoryId: Joi.string().required(),
      url: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      image: Joi.any(),
      priceMin: Joi.number(),
      priceMax: Joi.number(),
    }),
  }),
  updateMultiple: Joi.object({
    products: Joi.array().items({
      id: Joi.string(),
      storeId: Joi.string(),
      rootCategoryId: Joi.string(),
      url: Joi.string(),
      name: Joi.string(),
      price: Joi.string(),
    }),
  }),
  deleteMultiple: Joi.object({
    urls: Joi.array().required(),
  }),
};

module.exports = dbSchema;
