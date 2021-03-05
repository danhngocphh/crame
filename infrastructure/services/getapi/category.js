let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const { store: StoreModel } = require('../../database/models')


exports.Shopee = (storeName) => {
    return new Promise( async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            if(!store){
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const data = await axios.get(
                store.url.category,
                {
                    headers: store.headers
                }
            );
            const category = _.map(data.data.data.category_list, o => ({
                id: o.catid,
                name: o.display_name,
                url: getUrl(storeName,store.headers.Referer,o.catid)
            }))
            resolve(category);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Tiki =  (storeName) => {
    return new Promise( async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            if(!store){
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const data = await axios.get(
                store.url.category,
                {
                    headers: store.headers
                }
            );
            const category = _.map(data.data.data, o => ({
                id: o.item.id,
                name: o.item.title,
                url: o.item.url
            }))
            resolve(category);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

const getUrl = (storeName,urlHome, id) => {
    if (storeName == "shopee") {
        const result =  id != undefined ? urlHome + "/product-cat." +id  : config.crawler.defaultName; 
        return result
    } else {
        return 0
    }
};