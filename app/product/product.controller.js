const _ = require('lodash');
const { ActionResponse, APIError } = require('../../helpers');
const {
  product: ProductModel,
  keyword: KeywordModel,
  rootCategory: RootCategoryModel,
} = require('../../infrastructure/database/models');
const ProductService = require('./product.service');
const config = require('../../config');

const addKeyWord = (name) => {
  if (name) {
    let dateT = new Date(Date.now());
    dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    const keyword = new KeywordModel({
      keyword: name
        .normalize('NFD')
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .toLowerCase(),
      date: dateT,
    });
    return keyword.save();
  }
};

const getFamilyCategoryId = async (cateId) => {
  let result = [];
  const familyCategory = await RootCategoryModel.find({
    isActive: true,
    isRoot: true,
    _id: cateId,
  })
    .populate({
      path: 'listChild',
      populate: [
        {
          path: 'listChild',
          populate: [
            {
              path: 'listChild',
            },
          ],
        },
      ],
    })
    .exec();
  _.forEach(familyCategory, (cate) => {
    result.push(cate._id);
    _.forEach(cate.listChild, (cate) => {
      result.push(cate._id);
      _.forEach(cate.listChild, (cate) => {
        result.push(cate._id);
      });
    });
  });
  return result;
};

const getSameLevelCategory = async (cateId) => {
  const category = await RootCategoryModel.find({ parentId: cateId }).exec();
  return await RootCategoryModel.findById(category._id).populate({
    path: 'listChild',
  });
};

const ProductController = {
  getAll: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { name: qName, rootCategoryId: qRootCategoryId } = req.query;
      await addKeyWord(qName);
      const allCateId = await getFamilyCategoryId(qRootCategoryId);
      const searchName = new RegExp(qName || '', 'i');
      const { docs: productRecord, ...rest } = await ProductModel.paginate(
        {
          $and: [
            qName ? { $text: { $search: searchName } } : {},
            qRootCategoryId ? { rootCategoryId: { $in: allCateId } } : {},
            { isActive: true },
          ],
        },
        {
          ...req.paginateOptions,
          sort: 'price',
          populate: 'storeId',
        }
      );
      if(!_.isEmpty(productRecord)) {
        const relateCategory = await getSameLevelCategory(productRecord[0].rootCategoryId);
        console.log(relateCategory);
      }

      const productJson = await ProductService.toJson(productRecord);
      return actionResponse.getPaginateDataSuccess(productJson, rest);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const productRecord = await ProductModel.findById(req.params.id).populate(
        'storeId'
      );
      if (!productRecord)
        throw new APIError('Product was not found', httpStatus.NotFound);
      return actionResponse.getDataSuccess(productRecord);
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
        productCompare,
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
        productCompare,
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
      const product = ({
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
        productCompare,
      } = req.body);
      ProductModel.findOneAndUpdate(
        { _id: id },
        { $set: product },
        { new: true },
        async (err, doc) => {
          if (err) {
            throw new APIError(
              'Err on updateOne',
              config.httpStatus.BadRequest,
              err
            );
          }
          const productJson = await ProductService.toJson(doc);
          return actionResponse.createdDataSuccess(productJson);
        }
      );
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
            throw new APIError(
              'Err on delete',
              config.httpStatus.BadRequest,
              err
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
      const actionResponse = new ActionResponse(res);
      await ProductModel.insertMany(req.body.products);
      actionResponse.createdDataSuccess();
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  updateMultiple: async (req, res, next) => {
    try {
      var i,
        len = 0;
      const actionResponse = new ActionResponse(res);
      console.log(req.body.products);
      if (Array.isArray(req.body.products)) {
        len = req.body.products.length;
      }
      for (i = 0; i < len; i++) {
        for (var id in req.body.products[i]) {
          console.log(id);
        }
        ProductModel.update(
          { _id: id },
          req.body.products[i][id],
          function (err, numAffected) {
            if (err) {
              throw new APIError(
                'Err on update',
                config.httpStatus.BadRequest,
                err
              );
            }
          }
        );
      }
      const productJson = await ProductService.toJson(doc);
      return actionResponse.createdDataSuccess(productJson);
    } catch (error) {
      next(error);
    }
  },
  deleteMultiple: async (req, res, next) => {
    try {
      const { urls } = req.body;
      const actionResponse = new ActionResponse(res);
      await ProductModel.deleteMany({ url: { $in: urls } }).exec();
      return actionResponse.createdDataSuccess(req.body);
    } catch (error) {
      next(error);
    }
  },
  relatedProducts: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { name: qName, rootCategoryId: qRootCategoryId } = req.query;
      const arrKey = qName
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .split(' ', 3);
      console.log(arrKey);
      const getKey = arrKey.join(' ');
      const search = new RegExp(getKey || '', 'i');
      const productRecord = await ProductModel.find({
        $and: [
          qName ? { $text: { $search: search } } : {},
          qRootCategoryId ? { rootCategoryId: { $in: [qRootCategoryId] } } : {},
          { isActive: true },
        ],
      })
        .limit(5)
        .populate('storeId');
      const productJson = await ProductService.toJson(productRecord);
      return actionResponse.getDataSuccess(productJson);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
