const { ActionResponse, APIError } = require('../../helpers');
const { getProductAPI, getCategoryAPI, saveDB } = require('../../infrastructure/services');
const crawler = require("../../infrastructure/services/crawl")
const common = require("../../infrastructure/services/crawl/common")
const config = require('../../config');

const CrawlController = {
  callApiProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let products;
      switch (dataReq.storeId) {
        case "601974473bb314a8f475e723":
          products = await getProductAPI.Shopee(dataReq.storeId, dataReq.rootCategoryId, dataReq.categoryId, dataReq.limit);
          break;
        case "601d021a1e14b1464cb38624":
          products = await getProductAPI.Tiki(dataReq.storeId, dataReq.rootCategoryId, dataReq.categoryId, dataReq.limit);
          break;
        case "601cfc3d1e14b1464cb38620":
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
        case "601974473bb314a8f475e723":
          category = await getCategoryAPI.Shopee(dataReq.storeId);
          break;
        case "601d021a1e14b1464cb38624":
          category = await getCategoryAPI.Tiki(dataReq.storeId);
          break;
        case "601cfc3d1e14b1464cb38620":
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
      const browserInstance = await common.launchBrowserInstance();
      const products = await crawler.Product(browserInstance, dataReq.storeId, dataReq.rootCategoryId, dataReq.url)
      // Make sure all pages will close
      const pages = await browserInstance.pages();
      await Promise.all(pages.map((page) => page.close()));
      await browserInstance.close();
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
      // build browserInstance
      const browserInstance = await common.launchBrowserInstance();
      // crawl cate
      const category = await crawler.Category(browserInstance, dataReq.storeId);
      // Make sure all pages will close
      const pages = await browserInstance.pages();
      await Promise.all(pages.map((page) => page.close()));
      await browserInstance.close();
      // res data
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
