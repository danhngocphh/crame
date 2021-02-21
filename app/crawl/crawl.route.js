const { Router } = require('express');
const CrawlController = require('./crawl.controller');
const Middleware = require('../middlewares');
const CrawlSchema = require('./crawl.schema');

const route = Router();

route.post(
    '/apiproduct',
    Middleware.isValidate(CrawlSchema.apiProductPOST),
    CrawlController.callApiProduct
);

route.post(
    '/apicategory',
    Middleware.isValidate(CrawlSchema.apiCategoryPOST),
    CrawlController.callApiCategory
);

route.post(
    '/crawlproduct',
    Middleware.isValidate(CrawlSchema.apiProductPOST),
    CrawlController.crawlProduct
);


module.exports = route;
