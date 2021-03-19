const Joi = require('joi');
const { regex } = require('../../config');
const { roleEnum } = require('../../infrastructure/database/enum');
const _ = require('lodash')

const UserSchema = {
  updateMePUT: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    phoneNumber: Joi.string().regex(regex.phoneNumber).required().messages({
      "string.pattern.base": "Not a valid phone number"
    }),
    birthday: Joi.date().required(),
    address: Joi.string().required(),
    avatarPublicId: Joi.string(),
  }),
  changeMyPasswordPUT: Joi.object({
    oldPassword: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  }),
  createUserPOST: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    phoneNumber: Joi.string().regex(regex.phoneNumber).required().messages({
      "string.pattern.base": "Not a valid phone number"
    }),
    birthday: Joi.date().required(),
    address: Joi.string().required(),
    role: Joi.string().valid(..._.values(roleEnum)).required(),
  }),
  updateUserPUT: Joi.object({
    name: Joi.object({
      first: Joi.string().required(),
      last: Joi.string().required(),
    }).required(),
    phoneNumber: Joi.string().regex(regex.phoneNumber).required().messages({
      "string.pattern.base": "Not a valid phone number"
    }),
    birthday: Joi.date().required(),
    address: Joi.string().required(),
    role: Joi.string().valid(..._.values(roleEnum)).required(),
  }),
};

module.exports = UserSchema;
