const { ActionResponse, APIError } = require('../../helpers');
const { saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');

const dbController = {
  add: async (req, res, next) => {
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
