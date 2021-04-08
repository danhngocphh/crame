const { Router } = require('express');
const { promisify } = require("util");
const { ActionResponse, APIError } = require('../../helpers');
const cronJobController = require('./cronjob.controller');
const Middleware = require('../middlewares');
const { get: getAgenda } = require('../../infrastructure/cronjobs')
// const cronJobSchema = require('./cronjob.schema');
const {
    defineJob,
    jobOperations,
    jobAssertions,
    promiseJobOperation,
} = require("./cronjob.controller");

const route = Router();
const agenda = getAgenda();



const getJobMiddleware = (
    jobAssertion,
    jobOperation,
) => async (req, res, next) => {
    const actionResponse = new ActionResponse(res);
    console.log(req.body)
    const job = req.body;
    if (req.params.jobName) {
        job.name = req.params.jobName;
    }

    const jobs = await jobsReady;

    req.body = await promiseJobOperation(
        job,
        jobs,
        agenda,
        jobAssertion,
        jobOperation
    ).catch((error) => console.log(error));
    actionResponse.setupCronjobComplete(req.body)
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
        jobOperations.creat
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
