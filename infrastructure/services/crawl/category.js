let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { store: StoreModel } = require('../../database/models')


exports.Shopee = (storeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const url = store.dataCrawlCategory.url;
            const pageContent = await getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map( (index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text()  || config.crawler.defaultName
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Sendo = (storeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const url = store.dataCrawlCategory.url;
            const pageContent = await getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map( (index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text()  || config.crawler.defaultName
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Tiki = (storeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const url = store.dataCrawlCategory.url;
            const pageContent = await getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map( (index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text().trim()  || config.crawler.defaultName
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Lazada = (storeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            const url = store.dataCrawlCategory.url;
            const pageContent = await getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map( (index, value) => ({
                id: index,
                name: $(value).find(store.dataCrawlCategory.name).text().trim()  || config.crawler.defaultName
            }))
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

const getPageContent = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto(url, { waitUntil: 'networkidle2' });
        await autoScroll(page);
        return await page.content();
    } catch (err) {
        console.error(err);
    }
};


async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}