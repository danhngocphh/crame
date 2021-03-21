const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const rootCategorySchema = require('./rootcategory.schema');

const route = Router();


route.get('/list-root', rootCategoryController.getListRoot);

route.get('/:id', rootCategoryController.get);

route.get('/list-parent/:id', rootCategoryController.getListParent);

route.get('/list-child/:id', rootCategoryController.getListChild);

route.post('/',
    Middleware.isValidate(rootCategorySchema.set),
    rootCategoryController.add
);

route.post(
    '/child',
    Middleware.isValidate(rootCategorySchema.addChild),
    rootCategoryController.addChild
);

route.put(
    '/',
    Middleware.isValidate(rootCategorySchema.set),
    rootCategoryController.update
);

route.delete(
    '/child/:idRootCategory/:idChildCategory',
    Middleware.isValidate(rootCategorySchema.deleteChild),
    rootCategoryController.deleteChild
);

route.delete(
    '/:id',
    Middleware.isValidate(rootCategorySchema.delete),
    rootCategoryController.deleteItem
);

route.delete(
    '/remove/:id',
    Middleware.isValidate(rootCategorySchema.delete),
    rootCategoryController.remove
);

module.exports = route;
