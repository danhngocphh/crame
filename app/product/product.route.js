const { Router } = require('express');
const Middleware = require('../middlewares');
// const ProductSchema = require('./product.schema');
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
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.createOne
  );

route
  .route('/:id')
  .put(
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.updateOne
  )
  .delete(
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.deleteOne
  );

route
  .route('/bulk')
  .get(Middleware.attachPaginateOptions, ProductController.getAll)
  .post(
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.createMultiple
  )
  .put(
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.updateMultiple
  )
  .delete(
    // Middleware.isValidate(ProductSchema.createUserPOST),
    ProductController.deleteMultiple
  )

module.exports = route;
