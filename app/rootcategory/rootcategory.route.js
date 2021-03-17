const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const dbSchema = require('./rootcategory.schema');

const route = Router();

route.post(
    '/set',
    Middleware.isValidate(dbSchema.set),
    rootCategoryController.setList
);

route.get(
    '/get',
    Middleware.isValidate(dbSchema.get),
    rootCategoryController.getList
);


module.exports = route;
