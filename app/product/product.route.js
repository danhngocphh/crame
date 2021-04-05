const { Router } = require('express');
const Middleware = require('../middlewares');
const ProductService = require('./product.service');
const ProductController = require('./product.controller');

const route = Router();
route.param('productId', ProductService.findProductById);
route
  .route('/')
  .get(Middleware.attachPaginateOptions, ProductController.getAll);

module.exports = route;
