const axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

// clear all data in redis
// redisClient.flushall();

exports.getapiProduct_Shopee = (categoryid, limit) => {
    return new Promise( async (resolve, reject) => {
        try {
            const data = await axios.get(
                'https://shopee.vn/api/v2/search_items/?by=pop&match_id=' + categoryid + '&order=desc&page_type=search&limit=' + limit + '&version=2',
                {
                    headers: {
                        'Referer': 'https://shopee.vn'
                    }
                }
            );
            const _products = _.map(data.data.items, o => ({
                remoteId: o.itemid,
                storeId: new ObjectID("60182f422155bc700bf3a479"),
                rootCategoryId: new ObjectID("601830ac2155bc700bf3a47a"),
                categoryId: "shopee_" + categoryid,
                url: "https://shopee.vn/product/" + o.shopid + "/" + o.itemid,
                image: "https://cf.shopee.vn/file/" + o.image,
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

exports.getapiProduct_Tiki = (categoryid, limit) => {
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
                id: o.id,
                storeid: "sendo",
                categoryid: "sendo_" + categoryid,
                slug: "...",
                url: "https://www.sendo.vn/" + o.category_path,
                image: o.image,
                name: o.name,
                price: o.sale_price_min,
                pricemin: o.sale_price_min,
                pricemax: o.sale_price_max,
                brand: "...",
                type: o.product_type
              }))
            resolve(_products);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.getapiProduct_Sendo = (categoryid, limit) => {
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
                id: o.id,
                storeid: "tiki",
                categoryid: "tiki_" + categoryid,
                slug: "...",
                url: "http://tiki.vn/product/" + o.id,
                image: o.thumbnail_url,
                name: o.name,
                price: o.price,
                pricemin: o.price,
                pricemax: o.price,
                brand: o.brand_name,
                type: o.type
            }))
            resolve(_products);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};