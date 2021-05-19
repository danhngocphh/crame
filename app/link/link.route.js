const { Router } = require('express');
const linkController = require('./link.controller');
const Middleware = require('../middlewares');
const linkSchema = require('./link.schema');

const route = Router();

route.post(
  '/',
  Middleware.isValidate(linkSchema.get),
  linkController.get
);

route.post(
  '/add',
  Middleware.isValidate(linkSchema.set),
  linkController.add
);


module.exports = route;
