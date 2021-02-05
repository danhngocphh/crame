let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models')

// const HttpsProxyAgent = require("https-proxy-agent");

// const httpsAgent = new HttpsProxyAgent({host: "14.160.32.23", port: "8080"});

// //use axios as you normally would, but specify httpsAgent in the config
// axios = axios.create({httpsAgent});


// exports.Shopee = (storename , categoryid, limit) => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             const store = await StoreModel.findOne({ name: storename });
//             const data = await axios.get(
//                 'https://shopee.vn/api/v2/search_items/?by=pop&match_id=' + categoryid + '&order=desc&page_type=search&limit=' + limit + '&version=2',
//                 {
//                     headers: {
//                         'Referer': 'https://shopee.vn'
//                     }
//                 }
//             );
//             const _products = _.map(data.data.items, o => ({
//                 remoteId: o.itemid,
//                 storeId: new ObjectID("601974473bb314a8f475e723"),
//                 rootCategoryId: new ObjectID("601830ac2155bc700bf3a47a"),
//                 categoryId: "shopee_" + categoryid,
//                 url: "https://shopee.vn/product/" + o.shopid + "/" + o.itemid,
//                 image: "https://cf.shopee.vn/file/" + o.image,
//                 name: o.name,
//                 price: o.price,
//                 pricemin: o.price_min,
//                 pricemax: o.price_max,
//                 brand: o.brand,
//                 type: o.item_type
//             }))
//             resolve(_products);
//         } catch (error) {
//             reject(new APIError(error.message, config.httpStatus.BadRequest));
//         }
//     })
// };

exports.Shopee = (storename, nameRootCategory, categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storename });
            // const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
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
                rootCategoryId: new ObjectID("601830ac2155bc700bf3a47a"),
                categoryId: store.name + "_" + categoryid,
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

exports.Sendo = (categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const data = await axios.get(
                'https://searchlist-api.sendo.vn/web/categories/' + categoryid + '/products?listing_algo=algo13&page=1&platform=web&size='+ limit,
                {
                  headers: {
                    'Referer': 'https://www.sendo.vn/'
                  }
                }
              );
              const _products =  _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID("6019758e3bb314a8f475e724"),
                rootCategoryId: new ObjectID("601830ac2155bc700bf3a47a"),
                categoryId: "sendo_" + categoryid,
                url: "https://www.sendo.vn/" + o.category_path,
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

exports.Tiki = (categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const data = await axios.get(
                'https://tiki.vn/api/v2/products?category=' + categoryid + '&limit=' + limit,
                {
                    headers: {
                        'Referer': 'https://tiki.vn'
                    }
                }
            );
            const _products = _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID("6019734d3bb314a8f475e722"),
                rootCategoryId: new ObjectID("601830ac2155bc700bf3a47a"),
                categoryId: "tiki_" + categoryid,
                url: "http://tiki.vn/product/" + o.id,
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