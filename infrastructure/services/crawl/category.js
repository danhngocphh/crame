const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const cheerio = require("cheerio");
const { store: StoreModel } = require('../../database/models');
const { parseInt } = require('lodash');
const common = require("./common");

exports.Shopee = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const url = store.dataCrawlCategory.url;
            const pageContent = await common.getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map((index, value) => ({
                id: common.getIdProduct(storeName, $(value).attr('href')),
                name: $(value).find(store.dataCrawlCategory.name).text().trim() || config.crawler.defaultName,
                url: store.headers.Referer + $(value).attr('href')
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Tiki = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const url = store.dataCrawlCategory.url;
            const pageContent = await common.getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map((index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text().trim() || config.crawler.defaultName,
                url: $(value).find('a').attr('href')
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Sendo = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const url = store.dataCrawlCategory.url;
            const pageContent = await common.getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map((index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text().trim() || config.crawler.defaultName,
                url: store.headers.Referer + $(value).find('a').attr('href')
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Lazada = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const url = store.dataCrawlCategory.url;
            const pageContent = await common.getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map((index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text().trim() || config.crawler.defaultName,
                url: store.headers.Referer + $(value).attr('href').substring(15)
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

