const { Router } = require('express');
const storeController = require('./store.controller');
const Middleware = require('../middlewares');
const storeSchema = require('./store.schema');

const route = Router();

route.all('*', Middleware.isAuth);
/* Handle current user */

route
    .route('/:id')
    .get(storeController.getById)
    .delete(
        storeController.remove
    );

route
    .route('/')
    .post(
        Middleware.isValidate(storeSchema.set),
        storeController.add
    )
    .get(storeController.getListPaging)
    .put(
        Middleware.isValidate(storeSchema.set),
        storeController.update
    );

module.exports = route;
