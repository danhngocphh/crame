const _ = require('lodash');
const { ActionResponse, APIError } = require('../../helpers');
const {
  product: ProductModel,
} = require('../../infrastructure/database/models');
const ProductService = require('./product.service')

const ProductController = {
  getAll: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      console.log(req.paginateOptions);
      const { docs: productRecord, ...rest } = await ProductModel.paginate(
        {},
        req.paginateOptions
      );
      const userJson = await ProductService.toJson(productRecord);
      return actionResponse.getPaginateDataSuccess(userJson, rest);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
