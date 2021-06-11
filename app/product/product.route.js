const { Router } = require('express');
const Middleware = require('../middlewares');
const ProductSchema = require('./product.schema');
const ProductService = require('./product.service');
const ProductController = require('./product.controller');

const route = Router();
route.param('productId', ProductService.findProductById);

route.get('/related-products', ProductController.relatedProducts);

route
  .route('/bulk')
  .post(
    Middleware.isValidate(ProductSchema.createMultiple),
    ProductController.createMultiple
  )
  .put(
    Middleware.isValidate(ProductSchema.updateMultiple),
    ProductController.updateMultiple
  )
  .delete(
    Middleware.isValidate(ProductSchema.deleteMultiple),
    ProductController.deleteMultiple
  );

route
  .route('/:id')
  .get(ProductController.getById)
  .put(
    Middleware.isValidate(ProductSchema.updateOne),
    ProductController.updateOne
  )
  .delete(ProductController.deleteOne);

route
  .route('/:productId/like')
  .put(Middleware.isAuth, ProductController.likeProduct);

route
  .route('/')
  .get(Middleware.attachPaginateOptions, ProductController.getAll)
  .post(
    Middleware.isValidate(ProductSchema.createOne),
    ProductController.createOne
  );

module.exports = route;
