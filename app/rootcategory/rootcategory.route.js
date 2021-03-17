const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const rootCategorySchema = require('./rootcategory.schema');

const route = Router();


route.get('/listroot', rootCategoryController.getListRoot);

route.get('/:id', rootCategoryController.get);

route.get('/listparent/:id', rootCategoryController.getListParent);

route.get('/listchild/:id', rootCategoryController.getListChild);

route.post('/add',
    Middleware.isValidate(rootCategorySchema.set),
    rootCategoryController.add
);

route.post(
    '/addchild',
    Middleware.isValidate(rootCategorySchema.addChild),
    rootCategoryController.addChild
);

route.put(
    '/edit',
    Middleware.isValidate(rootCategorySchema.set),
    rootCategoryController.update
);

route.delete(
    '/deletechild',
    Middleware.isValidate(rootCategorySchema.deleteChild),
    rootCategoryController.deleteChild
);

route.delete(
    '/delete',
    Middleware.isValidate(rootCategorySchema.delete),
    rootCategoryController.deleteItem
);

route.delete(
    '/remove',
    Middleware.isValidate(rootCategorySchema.delete),
    rootCategoryController.remove
);

module.exports = route;
