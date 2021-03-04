const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { store: StoreModel } = require('../../database/models');
const { parseInt } = require('lodash');

exports.getData = (storeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ name: storeName });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const url = store.dataCrawlCategory.url;
            const pageContent = await getPageContent(url);
            const $ = await cheerio.load(pageContent);
            const totalCategory = $(store.dataCrawlCategory.totalCategory);
            const category = totalCategory.map((index, value) => ({
                id: getId(storeName, $(value).attr('href')),
                name: $(value).find(store.dataCrawlCategory.name).text() || config.crawler.defaultName
            }))
            // let cat = [];
            // console.log(totalCategory);
            // for (const i in totalCategory) {
            //     cat[i] = {
            //         id: getId(storeName, $(totalCategory[i]).attr('href')),
            //         name: $(totalCategory[i]).find(store.dataCrawlCategory.name).text()  || config.crawler.defaultName
            //     }
            // }
            resolve(category.get());
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

const getId = (storeName, value) => {
    if (storeName == "shopee") {
        const id = value != undefined ? value.split(".") : ['', 0];
        const result = id[1] != undefined ? parseInt(id[1]) : 0; 
        return result
    } else {
        return 0
    }
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