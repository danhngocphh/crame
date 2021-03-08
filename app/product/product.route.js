const { Router } = require('express');
const dbController = require('./product.controller');
const Middleware = require('../middlewares');
const dbSchema = require('./product.schema');

const route = Router();

route.post(
    '/add',
    Middleware.isValidate(dbSchema.product),
    dbController.add
);

module.exports = route;
