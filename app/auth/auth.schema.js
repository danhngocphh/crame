const Joi = require('joi');

const AuthSchema = {
  registerPOST: Joi.object({
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
  }),
  loginPOST: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
  })
};

module.exports = AuthSchema;
