const { Router } = require('express');
const CrawlController = require('./crawl.controller');
const Middleware = require('../middlewares');
const CrawlSchema = require('./crawl.schema');

const route = Router();

route.post(
    '/product-api',
    Middleware.isValidate(CrawlSchema.apiProductPOST),
    CrawlController.callApiProduct
);

route.post(
    '/category-api',
    Middleware.isValidate(CrawlSchema.CategoryPOST),
    CrawlController.callApiCategory
);

route.post(
    '/product',
    Middleware.isValidate(CrawlSchema.crawlProductPOST),
    CrawlController.crawlProduct
);

route.post(
    '/category',
    Middleware.isValidate(CrawlSchema.CategoryPOST),
    CrawlController.crawlCategory
);


module.exports = route;
