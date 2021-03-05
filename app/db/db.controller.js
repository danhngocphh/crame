const { ActionResponse, APIError } = require('../../helpers');
const { saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');


const dbController = {
  updateCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const category = dataReq.data;
      if (category && category.length > 0 && saveDB.category(dataReq.storeName, category)) {
        actionResponse.saveComplete(category);
      } else {
        throw new APIError('Cant update category', config.httpStatus.BadRequest, {
          data: 'Cant update category',
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
      console.log(category);
      if (category && category.length > 0 && saveDB.addCategory(dataReq.storeName, category)) {
        actionResponse.saveComplete(category, dataReq.storeName, dataReq.categoryId);
      } else {
        throw new APIError('Cant add category', config.httpStatus.BadRequest, {
          data: 'Cant add category',
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
      if (product && product.length > 0 && saveDB.product(product)) {
        actionResponse.saveComplete(product);
      } else {
        throw new APIError('Cant add product', config.httpStatus.BadRequest, {
          data: 'Cant add product',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = dbController;
