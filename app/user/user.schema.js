const Joi = require('joi');
const { regex } = require('../../config');

const UserSchema = {
  updatePOST: Joi.object({
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    phoneNumber: Joi.string().regex(regex.phoneNumber).required().messages({
      "string.pattern.base": "Not a valid phone number"
    }),
    birthday: Joi.date().required(),
    address: Joi.string().required(),
  }),
};

module.exports = UserSchema;
