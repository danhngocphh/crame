const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const rootCategoryService = require('./rootcategory.services');

const rootCategoryController = {
  getListRootPaging: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const list = await rootCategoryService.getListRootPaging(req.params);
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
  getById: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.getById(params.id)
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
  getListParentPaging: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.getListParentPaging(params)
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
      const { params } = req;
      const list = await rootCategoryService.deleteChild(params);
      if (list) {
        return actionResponse.getDataSuccess({ ...params});
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
      const { currentUser, params } = req;
      const list =await rootCategoryService.remove({ ...params, updatedBy: currentUser.id });
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
      const { currentUser, params } = req;
      const list =await rootCategoryService.deleteItem({ ...params, updatedBy: currentUser.id });
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
