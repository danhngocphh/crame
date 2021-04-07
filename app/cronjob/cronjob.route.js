const { Router } = require('express');
const { promisify } = require("util");
const { ActionResponse, APIError } = require('../../helpers');
const cronJobController = require('./cronjob.controller');
const Middleware = require('../middlewares');
const { get: agendaT } = require('../../infrastructure/cronjobs')
// const cronJobSchema = require('./cronjob.schema');
const {
    defineJob,
    jobOperations,
    jobAssertions,
    promiseJobOperation,
} = require("./cronjob.controller");
const route = Router();
const agenda = agendaT();

const getJobMiddleware = (
    jobAssertion,
    jobOperation,
    errorCode = 400
  ) => async (ctx, next) => {
    const job = {};
    if (ctx.params.jobName) {
      job.name = ctx.params.jobName;
    }
  
    const jobs = await jobsReady;
    ctx.body = await promiseJobOperation(
      job,
      jobs,
      agenda,
      jobAssertion,
      jobOperation
    ).catch((error) => ctx.throw(errorCode, error));
    await next();
  };

// route.all('*', Middleware.isAuth);
/* Handle current user */

const jobsReady = agenda._ready.then(async () => {
    const jobs = agenda._mdb.collection("agendaJobs");
    jobs.toArray = () => {
        const jobsCursor = jobs.find();
        return promisify(jobsCursor.toArray).bind(jobsCursor)();
    };
    await jobs
        .toArray()
        .then((jobsArray) =>
            Promise.all(jobsArray.map((job) => defineJob(job, jobs, agenda)))
        );
    return jobs;
});

route
    .route('/')
    // .get(async (ctx, next) => {
    //     if (settings.appId && ctx.request.headers["x-api-key"] !== settings.appId) {
    //         ctx.throw(403, "Forbidden");
    //     }
    //     ctx.body = await jobsReady.then((jobs) => jobs.toArray());
    //     await next();
    // })
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
        jobOperations.delete
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
