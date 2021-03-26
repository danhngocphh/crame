const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const storeService  = require('./store.services');

const storeController = {
  get: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await storeService.get(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get data', config.httpStatus.BadRequest, {
          msg: "Fail to get store. Check rootcategory Id, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getListPaging: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await storeService.getListPaging(params)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get data', config.httpStatus.BadRequest, {
          msg: "Fail to get store. Check rootcategory Id, pls!"
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
      const list = await storeService.add({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
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
        return actionResponse.getDataSuccess({ ...list});
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
      const list =await storeService.remove({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant remove store', config.httpStatus.BadRequest, {
          msg: "Fail to remove store. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteItem: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, params } = req;
      const list =await storeService.deleteItem({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant delete store', config.httpStatus.BadRequest, {
          msg: "Fail to delete store. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storeController;
