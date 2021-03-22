const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const rootCategorySchema = require('./rootcategory.schema');

const route = Router();

route.all('*', Middleware.isAuth);
/* Handle current user */

route.get('/list-root', rootCategoryController.getListRoot);

route
    .route('/')
    .post(
        Middleware.isValidate(rootCategorySchema.set),
        rootCategoryController.add
    )
    .put(
        Middleware.isValidate(rootCategorySchema.set),
        rootCategoryController.update
    )

route
    .route('/:id')
    .get(rootCategoryController.get)
    .delete(rootCategoryController.deleteItem)

route.get('/list-parent/:id', rootCategoryController.getListParent);

route.get('/list-child/:id', rootCategoryController.getListChild);


route.post(
    '/child',
    Middleware.isValidate(rootCategorySchema.addChild),
    rootCategoryController.addChild
);

route.delete(
    '/child/:idRootCategory/:idChildCategory',
    Middleware.isValidate(rootCategorySchema.deleteChild),
    rootCategoryController.deleteChild
);

route.delete(
    '/remove/:id',
    Middleware.isValidate(rootCategorySchema.delete),
    rootCategoryController.remove
);

module.exports = route;
