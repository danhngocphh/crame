const { Router } = require('express');
const { ActionResponse, APIError } = require('../../helpers');
// const cronJobController = require('./cronjob.controller');
// const Middleware = require('../middlewares');
// const cronJobSchema = require('./cronjob.schema');
const {
    jobOperations,
    jobAssertions,
    getJobMiddleware,
    jobsReady
} = require("./cronjob.controller");

const route = Router();


// route.all('*', Middleware.isAuth);
/* Handle current user */

route
    .route('/')
    .get(async (req, res, next) => {
        try {
            const actionResponse = new ActionResponse(res);
            const list = await jobsReady.then((jobs) => jobs.toArray());
            if (list) {
                return actionResponse.getDataSuccess({ ...list });
            } else {
                throw new APIError('Cant get data', config.httpStatus.BadRequest, {
                    msg: "Fail to get jobsReady. Check again, pls!"
                });
            }
        } catch (error) {
            next(error);
        }
    })
    .post(getJobMiddleware(
        jobAssertions.notExists,
        jobOperations.create
    ));

route
    .route('/:jobName')
    .delete(getJobMiddleware(
        jobAssertions.alreadyExists,
        jobOperations.delete
    ))
    .put(getJobMiddleware(
        jobAssertions.alreadyExists,
        jobOperations.update
    ));

route.post("/once", getJobMiddleware(
    jobAssertions.alreadyExists,
    jobOperations.once
));

route.post("/every", getJobMiddleware(
    jobAssertions.alreadyExists,
    jobOperations.every
));

route.post("/now", getJobMiddleware(
    jobAssertions.alreadyExists,
    jobOperations.now
));

route.post("/cancel", getJobMiddleware(
    jobAssertions.doNotAssert,
    jobOperations.cancel
));

module.exports = route;
