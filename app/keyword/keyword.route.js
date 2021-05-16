const { Router } = require('express');
const KeywordController = require('./keyword.controller');
const Middleware = require('../middlewares');
const KeywordSchema = require('./keyword.schema');

const route = Router();

route.post(
  '/',
  Middleware.isValidate(KeywordSchema.get),
  KeywordController.get
);


module.exports = route;
