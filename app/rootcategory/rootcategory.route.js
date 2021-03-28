const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const rootCategorySchema = require('./rootcategory.schema');

const route = Router();

// route.all('*', Middleware.isAuth);
/* Handle current user */

route.get(
    '/mega-menu',
    rootCategoryController.megaMenu
);


route
    .route('/')
    .get(rootCategoryController.getListPaging)
    .post(
        Middleware.isValidate(rootCategorySchema.set),
        rootCategoryController.add
    )

route
    .route('/:id')
    .get(rootCategoryController.getById)
    .delete(rootCategoryController.deleteItem)
    .put(
        Middleware.isValidate(rootCategorySchema.set),
        rootCategoryController.update
    )

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
