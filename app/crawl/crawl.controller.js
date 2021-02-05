const { ActionResponse, APIError } = require('../../helpers');
const { getProductAPI, saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');


const CrawlController = {
  add_API_Product_Shopee: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await getProductAPI.Shopee(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
      if (_products.length > 0) {
        saveDB.product(_products);
        actionResponse.getDataCrawled(_products, dataReq.storename, dataReq.categoryid);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storename}_${dataReq.namerootcategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  add_API_Product_Tiki: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await getProductAPI.Tiki(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
      if (_products.length > 0) {
        saveDB.product(_products);
        actionResponse.getDataCrawled(_products, dataReq.storename, dataReq.categoryid);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storename}_${dataReq.namerootcategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  add_API_Product_Sendo: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await getProductAPI.Sendo(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
      if (_products.length > 0) {
        saveDB.product(_products);
        actionResponse.getDataCrawled(_products, dataReq.storename, dataReq.categoryid);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storename}_${dataReq.namerootcategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
