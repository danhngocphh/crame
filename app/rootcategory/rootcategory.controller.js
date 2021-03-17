const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const { rootCategoryService } = require('./rootcategory.services');

const rootCategoryController = {
  getListRoot: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const list = await rootCategoryService.getListRoot();
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get list root', config.httpStatus.BadRequest, {
          msg: "Fail to get list rootcategory, check your database!",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.get(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get data', config.httpStatus.BadRequest, {
          msg: "Fail to get rootcategory. Check rootcategory Id, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getListParent: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.getListParent(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get list parent', config.httpStatus.BadRequest, {
          msg: "Fail to get list parent. Check parent Id, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getListChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.getListChild(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant get list child', config.httpStatus.BadRequest, {
          msg: "Fail to get list child. Check child Id, pls!"
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
      const list = await rootCategoryService.add({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant add rootcategory', config.httpStatus.BadRequest, {
          msg: "Fail to add rootcategory. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list = await rootCategoryService.addChild({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant add child category', config.httpStatus.BadRequest, {
          msg: "Fail to add child category. Check your database, pls!"
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
      const list = await rootCategoryService.update({ ...dataReq, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list});
      } else {
        throw new APIError('Cant update rootcategory', config.httpStatus.BadRequest, {
          msg: "Fail to update rootcategory. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const list =list
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant delete child category', config.httpStatus.BadRequest, {
          msg: "Fail to delete child category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list =await rootCategoryService.remove({ ...dataReq, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant remove category', config.httpStatus.BadRequest, {
          msg: "Fail to remove category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteItem: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list =await rootCategoryService.deleteItem({ ...item, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...dataReq});
      } else {
        throw new APIError('Cant delete category', config.httpStatus.BadRequest, {
          msg: "Fail to delete category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = rootCategoryController;
