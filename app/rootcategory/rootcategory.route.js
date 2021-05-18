const { Router } = require('express');
const rootCategoryController = require('./rootcategory.controller');
const Middleware = require('../middlewares');
const rootCategorySchema = require('./rootcategory.schema');

const route = Router();

route.all('*', Middleware.isAuth);
/* Handle current user */

route.get(
    '/mega-menu',
    rootCategoryController.megaMenu
);

route
    .route('/')
    .get(rootCategoryController.getListPaging)
    .post(
        Middleware.isValidate(rootCategorySchema.add),
        rootCategoryController.add
    )

route
    .route('/:id')
    .get(rootCategoryController.getById)
    .delete(rootCategoryController.deleteItem)
    .put(
        Middleware.isValidate(rootCategorySchema.update),
        rootCategoryController.update
    )

route.post(
    '/child',
    Middleware.isValidate(rootCategorySchema.addChildCategory),
    rootCategoryController.addChildCategory
);

route
    .route('/listChild/:idRootCategory/:idChild')
    .delete(rootCategoryController.deleteListChild)
    .post(
        rootCategoryController.addListChild
    )

route.delete(
    '/child/:idRootCategory/:idChildCategory',
    rootCategoryController.deleteChildCategory
);

route.delete(
    '/remove/:id',
    rootCategoryController.remove
);

module.exports = route;
