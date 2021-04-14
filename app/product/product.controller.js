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
      const productJson = await ProductService.toJson(productRecord);
      return actionResponse.getPaginateDataSuccess(productJson, rest);
    } catch (error) {
      next(error);
    }
  },
  createOne: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        storeId,
        remoteId,
        rootCategoryId,
        url,
        images,
        name,
        price,
        priceMin,
        priceMax,
        detail,
        brand,
        type,
        productCompare
      } = req.body;
      const product = new ProductModel({
        storeId,
        remoteId,
        rootCategoryId,
        url,
        images,
        name,
        price,
        priceMin,
        priceMax,
        detail,
        brand,
        type,
        productCompare
      });
      product.save(async function (err) {
        if (!err) {
          const productJson = await ProductService.toJson(product);
          return actionResponse.createdDataSuccess(productJson);
        } else {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const id = req.params.id;
      const product = {
        storeId,
        remoteId,
        rootCategoryId,
        url,
        images,
        name,
        price,
        priceMin,
        priceMax,
        detail,
        brand,
        type,
        productCompare
      } = req.body;
      ProductModel.findOneAndUpdate({ id }, { $set: product }, { new: true }, async (err, doc) => {
        if (err) {
          next(error);
        }
        const productJson = await ProductService.toJson(doc);
        return actionResponse.createdDataSuccess(productJson);
      });
    } catch (error) {
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const id = req.params.id;
      ProductModel.findById(req.params.id, function (err, product) {
        return product.remove(async function (err) {
          if (!err) {
            const productJson = await ProductService.toJson(product);
            return actionResponse.createdDataSuccess(productJson);
          } else {
            throw new APIError('Err on delete', config.httpStatus.BadRequest,
              err,
            );
          }
        });
      });
    } catch (error) {
      next(error);
    }
  },
  createMultiple: async (req, res, next) => {
    try {
      const arrayProduct = [];
      const actionResponse = new ActionResponse(res);
      if (!Array.isArray(req.body.products)) {
        throw new APIError('Products are not array', config.httpStatus.BadRequest,
          "Try again!",
        );
      } else {
        arrayProduct = req.body.products;
      }
      ProductModel.insertMany(arrayProduct)
        .then(async function (docs) {
          const productJson = await ProductService.toJson(docs);
          return actionResponse.createdDataSuccess(productJson);
        })
        .catch(function (err) {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },
  updateMultiple: async (req, res, next) => {
    try {
      var i, len = 0;
      const actionResponse = new ActionResponse(res);
      if (Array.isArray(req.body.products)) {
        len = req.body.products.length;
      }
      for (i = 0; i < len; i++) {
        for (var id in req.body.products[i]) {
          console.log(id);
        }
        ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
          if (err) {
            throw new APIError('Err on update', config.httpStatus.BadRequest,
              err,
            );
          }
        });
      }
      const productJson = await ProductService.toJson(doc);
      return actionResponse.createdDataSuccess(productJson);
    } catch (error) {
      next(error);
    }
  },
  deleteMultiple: async (req, res, next) => {
    try {
      var i, len = 0;
      const actionResponse = new ActionResponse(res);
      if (Array.isArray(req.body.ids)) {
        len = req.body.ids.length;
      }
      for (i = 0; i < len; i++) {
        for (var id in req.body.ids[i]) {
          console.log(id);
        }
        ProductModel.findById(id, function (err, product) {
          return product.remove(function (err) {
            if (err) {
              throw new APIError('Err on delete', config.httpStatus.BadRequest,
                err,
              );
            }
          });
        });
      }
      const productJson = await ProductService.toJson(req.body.ids);
      return actionResponse.createdDataSuccess(productJson);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
