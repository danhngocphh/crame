const { Router } = require('express');
const CrawlController = require('./crawl.controller');
const Middleware = require('../middlewares');
const CrawlSchema = require('./crawl.schema');

const route = Router();

route.post(
  '/category',
  Middleware.isAuth,
  Middleware.isValidate(CrawlSchema.scrapeCategoryPOST),
  CrawlController.scrapeCategory,
);

route.post(
  '/product',
  Middleware.isAuth,
  Middleware.isValidate(CrawlSchema.scrapeProductPOST),
  CrawlController.scrapeProduct,
);

route.post(
  '/product-detail',
  Middleware.isAuth,
  Middleware.isValidate(CrawlSchema.scrapeDetailProductPOST),
  CrawlController.scrapeDetailProduct,
);

module.exports = route;
