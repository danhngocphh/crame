const { Router } = require('express');
const dbController = require('./category.controller');
const Middleware = require('../middlewares');
const dbSchema = require('./category.schema');

const route = Router();

route.post(
    '/set',
    Middleware.isValidate(dbSchema.category),
    dbController.set
);

route.post(
    '/add',
    Middleware.isValidate(dbSchema.category),
    dbController.add
);


module.exports = route;
