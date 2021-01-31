const { Router } = require('express');
const CrawlController = require('./crawl.controller');
// const Middleware = require('../middlewares');

const route = Router();

route.post('/shopee-api', CrawlController.add_API_Product_Shopee);

route.post('/tiki-api', CrawlController.add_API_Product_Tiki);

route.post('/sendo-api', CrawlController.add_API_Product_Sendo);

module.exports = route;
