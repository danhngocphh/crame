const { Router } = require('express');
const CrawlController = require('./test.controller');
const Middleware = require('../middlewares');
const CrawlSchema = require('./test.schema');

const route = Router();

route.post(
    '/apiproduct',
    Middleware.isValidate(CrawlSchema.apiProductPOST),
    CrawlController.callApiProduct
);

route.post(
    '/apicategory',
    Middleware.isValidate(CrawlSchema.CategoryPOST),
    CrawlController.callApiCategory
);

route.post(
    '/crawlproduct',
    Middleware.isValidate(CrawlSchema.crawlProductPOST),
    CrawlController.crawlProduct
);

route.post(
    '/crawlcategory',
    Middleware.isValidate(CrawlSchema.CategoryPOST),
    CrawlController.crawlCategory
);


module.exports = route;
