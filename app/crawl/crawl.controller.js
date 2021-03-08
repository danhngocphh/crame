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
      switch (dataReq.storeId) {
        case "shopee":
          products = await getProductAPI.Shopee(dataReq.storeId, dataReq.rootCategoryId, dataReq.categoryId, dataReq.limit);
          break;
        case "tiki":
          products = await getProductAPI.Tiki(dataReq.storeId, dataReq.rootCategoryId, dataReq.categoryId, dataReq.limit);
          break;
        case "sendo":
          products = await getProductAPI.Sendo(dataReq.storeId, dataReq.rootCategoryId, dataReq.categoryId, dataReq.limit);
          break;
      }
      if (products && products.length > 0) {
        actionResponse.getDataCrawled(products, dataReq.storeId, dataReq.categoryId);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: config.crawler.nullStore,
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
      switch (dataReq.storeId) {
        case "shopee":
          category = await getCategoryAPI.Shopee(dataReq.storeId);
          break;
        case "tiki":
          category = await getCategoryAPI.Tiki(dataReq.storeId);
          break;
        case "sendo":
          category = await getProductAPI.Sendo(dataReq.storeId);
          break;
      }
      if (category && category.length > 0) {
        actionResponse.getCategoryCrawled(category, dataReq.storeId);
      } else {
        throw new APIError('Cant get category', config.httpStatus.BadRequest, {
          data: config.crawler.nullStore,
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
      switch (dataReq.storeId) {
        case "shopee":
          products = await crawlProduct.Shopee(dataReq.storeId, dataReq.rootCategoryId, dataReq.url);
          break;
        case "tiki":
          products = await crawlProduct.Tiki(dataReq.storeId, dataReq.rootCategoryId, dataReq.url);
          break;
        case "sendo":
          products = await crawlProduct.Sendo(dataReq.storeId, dataReq.rootCategoryId, dataReq.url);
          break;
        case "lazada":
          products = await crawlProduct.Lazada(dataReq.storeId, dataReq.rootCategoryId, dataReq.url);
          break;
      }
      if (products && products.length > 0) {
        actionResponse.getDataCrawled(products, dataReq.storeId, dataReq.categoryId);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storeId}_${dataReq.rootCategoryId}`,
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
      switch (dataReq.storeId) {
        case "shopee":
          category = await crawlCategory.Shopee(dataReq.storeId);
          break;
        case "tiki":
          category = await crawlCategory.Tiki(dataReq.storeId);
          break;
        case "sendo":
          category = await crawlCategory.Sendo(dataReq.storeId);
          break;
        case "lazada":
          category = await crawlCategory.Lazada(dataReq.storeId);
          break;
      }
      if (category && category.length > 0) {
        actionResponse.getCategoryCrawled(category, dataReq.storeId);
      } else {
        throw new APIError('Cant get category', config.httpStatus.BadRequest, {
          data: `Cant get category form ${dataReq.storeId}_${dataReq.rootCategoryId}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
