const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const dbSchema = require('./category.schema');

const route = Router();

route.post(
    '/set',
    Middleware.isValidate(dbSchema.category),
    rootCategoryController.set
);

route.post(
    '/add',
    Middleware.isValidate(dbSchema.category),
    rootCategoryController.add
);


module.exports = route;
