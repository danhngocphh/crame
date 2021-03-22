const { Router } = require('express');
const storeController = require('./store.controller');
const Middleware = require('../middlewares');
const storeSchema = require('./store.schema');

const route = Router();

// route.all('*', Middleware.isAuth);
/* Handle current user */

// route.get('/all', rootCategoryController.getAll);

route   
    .route('/:id')
    .get(storeController.get)
    .delete(
        storeController.deleteItem
    );

route
    .route('/')
    .post(
        Middleware.isValidate(storeSchema.set),
        storeController.add
    )
    .put(
        Middleware.isValidate(storeSchema.set),
        storeController.update      
    );

route.delete(
    '/remove/:id',
    storeController.remove
);

module.exports = route;
