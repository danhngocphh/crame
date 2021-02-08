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

module.exports = route;
