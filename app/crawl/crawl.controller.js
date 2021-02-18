const { ActionResponse, APIError } = require('../../helpers');
const { getProductAPI, getCategoryAPI, saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');


const CrawlController = {
  callApiProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let _products;
      switch (dataReq.storeName) {
        case "shopee":
          _products = await getProductAPI.Shopee(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
        case "tiki":
          _products = await getProductAPI.Tiki(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
        case "sendo":
          _products = await getProductAPI.Sendo(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
      }
      if (_products && _products.length > 0) {
        saveDB.product(_products);
        actionResponse.getDataCrawled(_products, dataReq.storeName, dataReq.categoryId);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeName}_${dataReq.nameRootCategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  callApiCategory:  async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let _category;
      switch (dataReq.storeName) {
        case "shopee":
          _category = await getCategoryAPI.Shopee(dataReq.storeName);
          break;
        case "tiki":
          _category = await getCategoryAPI.Tiki(dataReq.storeName);
          break;
        case "sendo":
          _category = await getProductAPI.Sendo(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
      }
      if (_category && _category.length > 0) {
        saveDB.category(dataReq.storeName, _category);
        actionResponse.getCategoryCrawled(_category, dataReq.storeName);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeName}_${dataReq.nameRootCategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
