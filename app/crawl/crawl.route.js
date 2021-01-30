const { Router } = require('express');
const CrawlController = require('./crawl.controller');
// const Middleware = require('../middlewares');

const route = Router();

route.post('/shopee-api', CrawlController.getapiProduct_Shopee);

route.post('/tiki-api', CrawlController.getapiProduct_Tiki);

route.post('/sendo-api', CrawlController.getapiProduct_Sendo);

module.exports = route;
