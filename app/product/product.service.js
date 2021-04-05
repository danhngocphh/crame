const _ = require('lodash');

const { httpStatus } = require('../../config');
const { APIError } = require('../../helpers');
const {
  product: ProductModel,
} = require('../../infrastructure/database/models');

const ProductService = {
  findProductById: async (req, res, next, productId) => {
    try {
      const productRecord = await ProductModel.findById(productId).exec();
      if (!productRecord)
        throw new APIError('Data was not found', httpStatus.NotFound);
      req.product = productRecord;
      return next();
    } catch (error) {
      next(error);
    }
  },
  toJson: async (data) => {
    const transform = async (record) => {
      const JsonData = record.toJSON();
      return JsonData;
    };
    if (!_.isArray(data)) return await transform(data);
    return await Promise.all(
      _.map(data, async (record) => await transform(record))
    );
  },
};

module.exports = ProductService;
