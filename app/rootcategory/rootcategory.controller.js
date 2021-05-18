const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const rootCategoryService = require('./rootcategory.services');

const rootCategoryController = {
  getById: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.getById(params.id)
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant get data', config.httpStatus.BadRequest, {
          msg: "Fail to get rootcategory. Check rootcategory Id, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getListPaging: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { query, paginateOptions } = req;
      const { rootCategoryRecords, rest } = await rootCategoryService.getListPaging({ ...query, paginateOptions })
      return actionResponse.getPaginateDataSuccess(rootCategoryRecords, rest);
    } catch (error) {
      next(error);
    }
  },
  megaMenu: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const rootCategoryJson = await rootCategoryService.megaMenu()
      return actionResponse.getDataSuccess(rootCategoryJson);
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
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant add rootcategory', config.httpStatus.BadRequest, {
          msg: "Fail to add rootcategory. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addChildCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: dataReq } = req;
      const list = await rootCategoryService.addChild({ ...dataReq, createdBy: currentUser.id, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
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
      const id = req.params.id;
      const list = await rootCategoryService.update({ id,...dataReq, updatedBy: currentUser.id })
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant update rootcategory', config.httpStatus.BadRequest, {
          msg: "Fail to update rootcategory. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteChildCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      const list = await rootCategoryService.deleteChild(params);
      console.log(list)
      if (list) {
        return actionResponse.getDataSuccess({ ...params });
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
      const list = await rootCategoryService.remove({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
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
      const list = await rootCategoryService.deleteItem({ ...params, updatedBy: currentUser.id });
      if (list) {
        return actionResponse.getDataSuccess({ ...list });
      } else {
        throw new APIError('Cant delete category', config.httpStatus.BadRequest, {
          msg: "Fail to delete category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addListChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      let getRootCategory = await rootCategoryService.getById(params.idRootCategory)
      if (getRootCategory) {
        getRootCategory.listChild.push(params.idChild);
        getRootCategory.save();
        return actionResponse.getDataSuccess({ ...getRootCategory })
      } else {
        throw new APIError('Cant add listChild category', config.httpStatus.BadRequest, {
          msg: "Fail to add listChild category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteListChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { params } = req;
      let getRootCategory = await rootCategoryService.getById(params.idRootCategory)
      if (getRootCategory) {
        getRootCategory.listChild.pull(params.idChild);
        getRootCategory.save();
        return actionResponse.getDataSuccess({ ...getRootCategory })
      } else {
        throw new APIError('Cant delete listChild category', config.httpStatus.BadRequest, {
          msg: "Fail to delete listChild category. Check your database, pls!"
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = rootCategoryController;
