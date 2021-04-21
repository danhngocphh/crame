const { Router } = require('express');
const Middleware = require('../middlewares');
const ProductSchema = require('./product.schema');
const ProductService = require('./product.service');
const ProductController = require('./product.controller');

const route = Router();
route.param('productId', ProductService.findProductById);
route
  .route('/')
  .get(
    Middleware.attachPaginateOptions,
    ProductController.getAll
  )
  .post(
    Middleware.isValidate(ProductSchema.createOne),
    ProductController.createOne
  );

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
  )

route
  .route('/:id')
  .put(
    Middleware.isValidate(ProductSchema.updateOne),
    ProductController.updateOne
  )
  .delete(
    ProductController.deleteOne
  );



module.exports = route;
