let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models')


exports.Shopee = (storename, nameRootCategory, categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
            const store = await StoreModel.findOne({ name: storename });
            const data = await axios.get(
                store.dataCallAPI.urlHeader + categoryid + store.dataCallAPI.urlMiddle + limit +  store.dataCallAPI.urlFooter,
                {
                    headers: {
                        'Referer': store.url
                    }
                }
            );
            const _products = _.map(data.data.items, o => ({
                remoteId: o.itemid,
                storeId: new ObjectID(store.id),
                rootCategoryId: new ObjectID(rootCategory.id),
                url: store.dataCallAPI.urlProduct + o.shopid + "/" + o.itemid,
                image: store.dataCallAPI.imageProduct + o.image,
                name: o.name,
                price: o.price,
                pricemin: o.price_min,
                pricemax: o.price_max,
                brand: o.brand,
                type: o.item_type
            }))
            resolve(_products);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Sendo = (storename, nameRootCategory, categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
            const store = await StoreModel.findOne({ name: storename });
            const data = await axios.get(
                store.dataCallAPI.urlHeader + categoryid + store.dataCallAPI.urlMiddle + limit,
                {
                  headers: {
                    'Referer': store.url
                  }
                }
              );
              const _products =  _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID(store.id),
                rootCategoryId: new ObjectID(rootCategory.id),
                url: store.dataCallAPI.urlProduct + o.category_path,
                image: o.image,
                name: o.name,
                price: o.sale_price_min,
                priceMin: o.sale_price_min,
                priceMax: o.sale_price_max,
                brand: "...",
                type: o.product_type.toString()
              }))
            resolve(_products);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Tiki = (storename, nameRootCategory, categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
            const store = await StoreModel.findOne({ name: storename });
            const data = await axios.get(
                store.dataCallAPI.urlHeader + categoryid + store.dataCallAPI.urlMiddle + limit,
                {
                    headers: {
                        'Referer': store.url
                    }
                }
            );
            const _products = _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID(store.id),
                rootCategoryId: new ObjectID(rootCategory.id),
                url: store.dataCallAPI.urlProduct + o.id,
                image: o.thumbnail_url,
                name: o.name,
                price: o.price,
                priceMin: o.price,
                priceMax: o.price,
                brand: o.brand_name,
                type: o.type
            }))
            resolve(_products);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};