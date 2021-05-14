const _ = require('lodash');
const { ActionResponse, APIError } = require('../../helpers');
const {
  product: ProductModel,
} = require('../../infrastructure/database/models');
const ProductService = require('./product.service')
const config = require('../../config')

const ProductController = {
  getAll: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        name: qName
      } = req.query;
      const searchName = new RegExp(qName || '', 'i');
      const { docs: productRecord, ...rest } = await ProductModel.paginate(
        {
          $and: [
            qName ? { name: searchName } : {},
            { isActive: true }
          ],
        },
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
      ProductModel.findOneAndUpdate({ _id: id }, { $set: product }, { new: true }, async (err, doc) => {
        if (err) {
          throw new APIError('Err on updateOne', config.httpStatus.BadRequest,
            err,
          );
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
      ProductModel.findById(id, function (err, product) {
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
      let arrayProduct = [];
      const actionResponse = new ActionResponse(res);
      if (Array.isArray(req.body.products)) {
        arrayProduct = req.body.products;
      } else {
        throw new APIError('Products are not array', config.httpStatus.BadRequest,
          "Try again!",
        );
      }
      ProductModel.insertMany(arrayProduct)
        .then(async function (docs) {
          const productJson = await ProductService.toJson(docs);
          return actionResponse.createdDataSuccess(productJson);
        })
        .catch(function (err) {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  updateMultiple: async (req, res, next) => {
    try {
      var i, len = 0;
      const actionResponse = new ActionResponse(res);
      console.log(req.body.products)
      if (Array.isArray(req.body.products)) {
        len = req.body.products.length;
      }
      console.log("dmm-------->", req.body.products[0][id]);
      for (i = 0; i < len; i++) {
        for (var id in req.body.products[i]) {
          console.log(id);
        }
        console.log("dmmm----->", req.body.products[i][id]);
        ProductModel.update({ _id: id }, req.body.products[i][id], function (err, numAffected) {
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
        ProductModel.findById(req.body.ids[i], function (err, product) {
          return product.remove(function (err) {
            if (err) {
              throw new APIError('Err on delete', config.httpStatus.BadRequest,
                err,
              );
            }
          });
        });
      }
      return actionResponse.createdDataSuccess(req.body);
    } catch (error) {
      next(error);
    }
  },
  relatedProducts: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        name: qName,
        rootCategoryId: qRootCategoryId
      } = req.query;
      const arrKey = qName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(' ', 3);
      const getKey = arrKey.join(" ");
      const search = new RegExp(getKey || '', 'i');
      const productRecord = await ProductModel.find(
        {
          $and: [
            qName ? { name: search } : {},
            qRootCategoryId ? { rootCategoryId: qRootCategoryId } : {},
            { isActive: true }
          ],
        }
      ).limit(5);
      const productJson = await ProductService.toJson(productRecord);
      return actionResponse.getDataSuccess(productJson);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
