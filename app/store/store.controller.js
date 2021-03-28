const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const storeService = require('./store.services');

const storeController = {
  getById: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await storeService.getById(params.id)
      return actionResponse.getDataSuccess({ ...list });
    } catch (error) {
      next(error);
    }
  },
  getListPaging: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { query, paginateOptions } = req;
      const { storeJson, rest } = await storeService.getListPaging({ ...query, paginateOptions })
      return actionResponse.getPaginateDataSuccess(storeJson, rest);
    } catch (error) {
      next(error);
    }
  },
  add: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list = await storeService.add({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant add store', config.httpStatus.BadRequest, {
          msg: "Fail to add store. Check your database, pls!"
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
      const list = await storeService.update({ ...dataReq, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant update store', config.httpStatus.BadRequest, {
          msg: "Fail to update store. Check your database, pls!"
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
      const list = await storeService.remove({ ...params, updatedBy: currentUser.id });
      return actionResponse.getDataSuccess({ ...list });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storeController;
