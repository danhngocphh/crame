let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const { store: StoreModel } = require('../../database/models')


exports.Shopee = (storeName) => {
    return new Promise( async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const data = await axios.get(
                "https://shopee.vn/api/v2/category_list/get?match",
                {
                    headers: {
                        'Referer': "https://shopee.vn"
                    }
                }
            );
            const category = _.map(data.data.data.category_list, o => ({
                id: o.catid,
                name: o.display_name
            }))
            resolve(category);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

// exports.Sendo = (storename, nameRootCategory, categoryid, limit) => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
//             const store = await StoreModel.findOne({ name: storename });
//             const data = await axios.get(
//                 store.dataCallAPI.urlHeader + categoryid + store.dataCallAPI.urlMiddle + limit,
//                 {
//                   headers: {
//                     'Referer': store.url
//                   }
//                 }
//               );
//               const _products =  _.map(data.data.data, o => ({
//                 remoteId: o.id,
//                 storeId: new ObjectID(store.id),
//                 rootCategoryId: new ObjectID(rootCategory.id),
//                 url: store.dataCallAPI.urlProduct + o.category_path,
//                 image: o.image,
//                 name: o.name,
//                 price: o.sale_price_min,
//                 priceMin: o.sale_price_min,
//                 priceMax: o.sale_price_max,
//                 brand: "...",
//                 type: o.product_type.toString()
//               }))
//             resolve(_products);
//         } catch (error) {
//             reject(new APIError(error.message, config.httpStatus.BadRequest));
//         }
//     })
// };

exports.Tiki =  (storeName) => {
    return new Promise( async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const data = await axios.get(
                "https://tiki.vn/api/shopping/v2/mega_menu",
                {
                    headers: {
                        'Referer': "https://tiki.vn/"
                    }
                }
            );
            const category = _.map(data.data.data, o => ({
                id: o.item.id,
                name: o.item.title
            }))
            resolve(category);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};