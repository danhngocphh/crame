const { Router } = require('express');
const storeController = require('./store.controller');
const Middleware = require('../middlewares');
const storeSchema = require('./store.schema');

const route = Router();

// route.all('*', Middleware.isAuth);
/* Handle current user */

route
    .route('/:id')
    .get(storeController.getById)
    .delete(
        Middleware.isAuth,
        storeController.remove
    );

route
    .route('/')
    .post(
        Middleware.isAuth,
        Middleware.isValidate(storeSchema.set),
        storeController.add
    )
    .get(storeController.getListPaging)
    .put(
        Middleware.isAuth,
        Middleware.isValidate(storeSchema.set),
        storeController.update
    );

module.exports = route;
