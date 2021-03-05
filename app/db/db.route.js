const { Router } = require('express');
const dbController = require('./db.controller');
const Middleware = require('../middlewares');
const dbSchema = require('./db.schema');

const route = Router();

route.post(
    '/set-category',
    Middleware.isValidate(dbSchema.category),
    dbController.setCategory
);

route.post(
    '/add-category',
    Middleware.isValidate(dbSchema.category),
    dbController.addCategory
);

route.post(
    '/add-product',
    Middleware.isValidate(dbSchema.product),
    dbController.addProduct
);

module.exports = route;
