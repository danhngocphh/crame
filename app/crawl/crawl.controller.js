const { ActionResponse } = require('../../helpers');
const CrawlService = require('./crawl.service');

const CrawlController = {
  scrapeCategory: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const categories = await CrawlService.scrapeCategory(req.body);
      actionResponse.getDataSuccess(categories);
    } catch (error) {
      next(error);
    }
  },
  scrapeProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const productUrls = await CrawlService.scrapeProduct(req.body);
      actionResponse.getDataSuccess(productUrls);
    } catch (error) {
      next(error);
    }
  },
  scrapeDetailProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const detailProduct = await CrawlService.scrapeDetailProduct(req.body);
      actionResponse.getDataSuccess(detailProduct);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = CrawlController;
