const storeId = "601974473bb314a8f475e723";
const rootCategoryId = "601830ac2155bc700bf3a47a";
const url = "https://shopee.vn/Th%E1%BB%9Di-Trang-Nam-cat.78";
const logger = require('../../logger');
const common = require("../../services/crawl/common");
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const ObjectID = require('mongodb').ObjectID;
const { store: StoreModel, rootCategory: rootCategoryModel } = require('../../database/models');

module.exports = function (agenda) {
    agenda.define("crawlProduct", async () => {
        try {
            const browserInstance = await common.launchBrowserInstance();
            logger.info(`Start crawling product: Store(` + storeId + `)`); 
            const rootCategory = await rootCategoryModel.findOne({ _id: rootCategoryId });
            if (!rootCategory) {
                reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
            }
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const page = await browserInstance.newPage();
            await page.goto(url, { waitUntil: 'load', timeout: 0 });
            await common.autoScroll(page);
            const detailUrls = await page.$$eval(store.dataCrawlProduct.totalItem, (urls) => {
                return urls.map((url) => url.href);
            });
            const scrapeDetailProduct = async (browserInstance, url) => {
                let dataObj = {};
                let newPage = await browserInstance.newPage();
                await newPage.goto(url, { waitUntil: 'load', timeout: 0 });
                dataObj['remoteId'] = url.substring(url.length - 10) || config.crawler.defaultName;
                dataObj['storeId'] = new ObjectID(store.id);
                dataObj['rootCategoryId'] = new ObjectID(rootCategory.id);
                dataObj['url'] = url || config.crawler.defaultName;
                dataObj['image'] = await newPage.$$eval(
                    store.dataCrawlProduct.image,
                    (imageUrls) =>
                        imageUrls.map((imageUrl) =>
                            imageUrl.tagName === 'DIV'
                                ? imageUrl.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1')
                                : imageUrl.src
                        )
                );
                dataObj['name'] = await newPage.$eval(store.dataCrawlProduct.name, (name) =>
                    name.textContent.trim()
                );
                dataObj['price'] = await newPage.$eval(store.dataCrawlProduct.price, (price) =>
                    price.textContent.trim()
                );
                dataObj['priceMin'] = await newPage.$eval(store.dataCrawlProduct.price, (price) =>
                    price.textContent.trim()
                );
                dataObj['priceMax'] = await newPage.$eval(store.dataCrawlProduct.price, (price) =>
                    price.textContent.trim()
                );
                dataObj['detail'] = await newPage.$eval(store.dataCrawlProduct.detail, text => text.textContent) || config.crawler.defaultName;
                dataObj['brand'] = config.crawler.defaultName;
                dataObj['type'] = config.crawler.defaultName;
                await newPage.close();
                return dataObj;
            };
            const products = [];
            for (let key in detailUrls) {
                const product = await scrapeDetailProduct(
                    browserInstance,
                    detailUrls[key]
                );
                products.push(product);
                console.log(product);
            }
            await page.close();
            logger.info(`Crawl category done: Store(` + storeId + `)`);
        } catch (err) {
            console.log(err)
        }
    });
};