const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const cronJobService  = require('./cronjob.services');

const storeController = {
  get: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await cronJobService.get(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get cronjob', config.httpStatus.BadRequest, {
          msg: "Fail to get cronjob. Check rootcategory Id, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  add: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list = await cronJobService.add({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant add cronjob', config.httpStatus.BadRequest, {
          msg: "Fail to add cronjob. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list = await cronJobService.update({ ...dataReq, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant update cronjob', config.httpStatus.BadRequest, {
          msg: "Fail to update cronjob. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, params } = req;
      const list =await cronJobService.remove({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant remove cronjob', config.httpStatus.BadRequest, {
          msg: "Fail to remove cronjob. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  cancel: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, params } = req;
      const list =await cronJobService.cancel({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant cancel cronjob', config.httpStatus.BadRequest, {
          msg: "Fail to cancel cronjob. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storeController;
