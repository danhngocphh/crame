const { Router } = require('express');
const cronJobController = require('./cronjob.controller');
const Middleware = require('../middlewares');
const cronJobSchema = require('./cronjob.schema');

const route = Router();

// route.all('*', Middleware.isAuth);
/* Handle current user */

// route.get('/all', rootCategoryController.getAll);

route   
    .route('/:id')
    .get(cronJobController.get)
    .delete(
        cronJobController.cancel
    );

route
    .route('/')
    .post(
        Middleware.isValidate(cronJobSchema.set),
        cronJobController.add
    )
    .put(
        Middleware.isValidate(cronJobSchema.set),
        cronJobController.update      
    );

route.delete(
    '/remove/:id',
    cronJobController.remove
);

module.exports = route;
