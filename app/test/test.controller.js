const { ActionResponse, APIError } = require('../../helpers');
const { crawlProduct, crawlCategory, getProductAPI, getCategoryAPI, saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');


const CrawlController = {
  callApiProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let products;
      switch (dataReq.storeName) {
        case "shopee":
          products = await getProductAPI.Shopee(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
        case "tiki":
          products = await getProductAPI.Tiki(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
        case "sendo":
          products = await getProductAPI.Sendo(dataReq.storeName, dataReq.nameRootCategory, dataReq.categoryId, dataReq.limit);
          break;
      }
      if (products && products.length > 0) {
        actionResponse.getDataCrawled(products, dataReq.storeName, dataReq.categoryId);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeName}_${dataReq.nameRootCategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  callApiCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let category;
      switch (dataReq.storeName) {
        case "shopee":
          category = await getCategoryAPI.Shopee(dataReq.storeName);
          break;
        case "tiki":
          category = await getCategoryAPI.Tiki(dataReq.storeName);
          break;
        case "sendo":
          category = await getProductAPI.Sendo(dataReq.storeName);
          break;
      }
      if (category && category.length > 0) {
        actionResponse.getCategoryCrawled(category, dataReq.storeName);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeName}_${dataReq.nameRootCategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  crawlProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let products;
      switch (dataReq.storeName) {
        case "shopee":
          products = await crawlProduct.Shopee(dataReq.storeName, dataReq.nameRootCategory, dataReq.url);
          break;
        case "tiki":
          products = await crawlProduct.Tiki(dataReq.storeName, dataReq.nameRootCategory, dataReq.url);
          break;
        case "sendo":
          products = await crawlProduct.Sendo(dataReq.storeName, dataReq.nameRootCategory, dataReq.url);
          break;
        case "lazada":
          products = await crawlProduct.Lazada(dataReq.storeName, dataReq.nameRootCategory, dataReq.url);
          break;
      }
      if (products && products.length > 0) {
        actionResponse.getDataCrawled(products, dataReq.storeName, dataReq.categoryId);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeName}_${dataReq.nameRootCategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  crawlCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let category;
      switch (dataReq.storeName) {
        case "shopee":
          category = await crawlCategory.Shopee(dataReq.storeName);
          break;
        case "tiki":
          category = await crawlCategory.Tiki(dataReq.storeName);
          break;
        case "sendo":
          category = await crawlCategory.Sendo(dataReq.storeName);
          break;
        case "lazada":
          category = await crawlCategory.Lazada(dataReq.storeName);
          break;
      }
      if (category && category.length > 0) {
        actionResponse.getCategoryCrawled(category, dataReq.storeName);
      } else {
        throw new APIError('Cant get category', config.httpStatus.BadRequest, {
          data: `Cant get category form ${dataReq.storeName}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
