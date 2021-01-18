const Joi = require('joi');

const AuthSchema = {
  registerPOST: Joi.object({
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  }),
  loginPOST: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
  }),
  refeshTokenPOST: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = AuthSchema;
