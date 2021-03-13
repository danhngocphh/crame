const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models');
const common = require("./common");

exports.Category = (browserInstance, storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await StoreModel.findOne({ _id: storeId });
            if (!store) {
                reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
            }
            const page = await browserInstance.newPage();
            await page.goto(`${store.baseUrl}${store.dataCrawlCategory.categoryPath}`,  {waitUntil: 'load', timeout: 0});
            const categories = [];
            await Promise.all(
                store.dataCrawlCategory.steps.map(async (step) => {
                    const result = await page.$$eval(step.selector, (ele) => {
                        return ele.map((a) => {
                            return {
                                name: a.textContent.trim() || config.crawler.defaultName,
                                url: a.href || config.crawler.defaultName,
                            };
                        });
                    });
                    categories.push(result);
                    console.log(result);
                })
            );
            await page.close();
            resolve(categories);
        } catch (error) {
            reject(new APIError(error.message, config.httpStatus.BadRequest));
        }
    })
};

exports.Product = (browserInstance, storeId, rootCategoryId, url) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rootCategory = await rootCategoryModel.findOne({ _id: rootCategoryId });
        if (!rootCategory) {
          reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
        }
        const store = await StoreModel.findOne({ _id: storeId });
        if (!store) {
          reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
        }
        const page = await browserInstance.newPage();
        await page.goto(url, {waitUntil: 'load', timeout: 0});
        await common.autoScroll(page);
        const detailUrls = await page.$$eval(store.dataCrawlProduct.totalItem, (urls) => {
          return urls.map((url) => url.href);
        });
        const scrapeDetailProduct = async (browserInstance, url) => {
          let dataObj = {};
          let newPage = await browserInstance.newPage();
          await newPage.goto(url,  {waitUntil: 'load', timeout: 0});
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
        resolve(products);
      } catch (error) {
        reject(new APIError(error.message, config.httpStatus.BadRequest));
      }
    })
  };




