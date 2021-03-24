const { cronjob: ModelCronJob } = require('../../infrastructure/database/models');

exports.add = async (data) => {
    const {
        name,
        detail,
        linkCrawl,
        startDate,
        intervalDuration,
        status,
        createdBy
    } = data;
    const cronjob = new ModelCronJob(
        {
            name,
            detail,
            linkCrawl,
            startDate,
            intervalDuration,
            status,
            createdBy
        }
    );
    const add = await cronjob.save(function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        }
    })
    return add;
};

exports.get = (id) => {
    const cronjob = ModelCronJob.findById(id, function (err, category) {
        if (err) return next(err);
    }).exec()
    return cronjob;
};

exports.update = (data) => {
    const {
        id,
        name,
        detail,
        linkCrawl,
        startDate,
        intervalDuration,
        status,
        updatedBy
    } = data;
    const cronjob = new ModelCronJob(
        {
            name,
            detail,
            linkCrawl,
            startDate,
            intervalDuration,
            status,
            updatedBy
        }
    );
    const editCronJob = ModelCronJob.findByIdAndUpdate(id, { $set: cronjob }, function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
    });
    return editCronJob;
};

exports.cancel = async (data) => {
    const {
        id,
        updatedBy
    } = data;

    const cancel = ModelCronJob.findByIdAndUpdate(id, { $set: { status: "Cancel", updatedBy } }, function (err, category) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return null
        };
    });
    return cancel;
};

exports.remove = (data) => {
    const { id } = data;
    ModelCronJob.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
            return false
        }
        return true;
    })
};

