const { ActionResponse, APIError } = require('../../helpers');
const { saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');

const dbController = {
  setCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const category = dataReq.data;
      if (category && category.length > 0 && saveDB.setCategory(dataReq.storeName, category)) {
        actionResponse.saveComplete(category);
      } else {
        throw new APIError(config.crawler.errSetCategory, config.httpStatus.BadRequest, {
          data: config.crawler.errSetCategory,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const category = dataReq.data;
      if (category && category.length > 0 && saveDB.addCategory(dataReq.storeName, category)) {
        actionResponse.saveComplete(category, dataReq.storeName, dataReq.categoryId);
      } else {
        throw new APIError(config.crawler.errAddCategory, config.httpStatus.BadRequest, {
          data: config.crawler.errAddCategory,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const product = dataReq.data;
      if (product && product.length > 0 && saveDB.addProduct(product)) {
        actionResponse.saveComplete(product);
      } else {
        throw new APIError(config.crawler.errAddProduct, config.httpStatus.BadRequest, {
          data: config.crawler.errAddProduct,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = dbController;
