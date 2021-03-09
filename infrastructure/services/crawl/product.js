const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const cheerio = require("cheerio");
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models')
const common = require("./common");
const puppeteer = require("puppeteer");



exports.Shopee = (storeId, rootCategoryId, url) => {
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
      // const url = 'https://shopee.vn/Th%E1%BB%9Di-Trang-Nam-cat.78';
      const pageContent = await common.getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const urls = totalItem.map((index, value) => (
        store.headers.Referer + $(value).find('a').attr('href') || config.crawler.defaultName
      ))
      // Loop through each of those links, open a new page instance and get the relevant data from them
      const browser = await puppeteer.launch({ headless: false,args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true });
      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitFor(10000);
        dataObj['remoteId'] = link.substring(link.length - 10) || config.crawler.defaultName;
        dataObj['storeId'] = new ObjectID(store.id);
        dataObj['rootCategoryId'] = new ObjectID(rootCategory.id);
        dataObj['url'] = link || config.crawler.defaultName; 
        dataObj['image'] = common.getUrlImage(await newPage.$eval(store.dataCrawlProduct.image, text => text.outerHTML))|| config.crawler.defaultName;
        dataObj['name'] = await newPage.$eval(store.dataCrawlProduct.name, text => text.textContent)|| config.crawler.defaultName;
        dataObj['price'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMin'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMax'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['detail'] = await newPage.$eval(store.dataCrawlProduct.detail, text => text.textContent)|| config.crawler.defaultName; 
        dataObj['brand'] = config.crawler.defaultName;
        dataObj['type'] = config.crawler.defaultName;
        resolve(dataObj);
        await newPage.close();
      });
      let products = [];
      for(link in urls.get()){
        let currentPageData = await pagePromise(urls[link]);
        products.push(currentPageData);
        console.log(currentPageData);
    }
      resolve(products);
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Sendo = (storeId, rootCategoryId, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ _id: rootCategoryId });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({  _id: storeId });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://www.sendo.vn/thoi-trang-nam/';
      const pageContent = await common.getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const urls = totalItem.map((index, value) => (
        store.headers.Referer + $(value).attr('href') || config.crawler.defaultName
      ))
      const browser = await puppeteer.launch({ headless: false,args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true });
      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitFor(10000);
        dataObj['remoteId'] = link.substring(link.length - 10) || config.crawler.defaultName;
        dataObj['storeId'] = new ObjectID(store.id);
        dataObj['rootCategoryId'] = new ObjectID(rootCategory.id);
        dataObj['url'] = link || config.crawler.defaultName; 
        dataObj['image'] = common.getUrlImage(await newPage.$eval(store.dataCrawlProduct.image, text => text.outerHTML))|| config.crawler.defaultName;
        dataObj['name'] = await newPage.$eval(store.dataCrawlProduct.name, text => text.textContent)|| config.crawler.defaultName;
        dataObj['price'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMin'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMax'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['detail'] = await newPage.$eval(store.dataCrawlProduct.detail, text => text.textContent)|| config.crawler.defaultName; 
        dataObj['brand'] = config.crawler.defaultName;
        dataObj['type'] = config.crawler.defaultName;
        resolve(dataObj);
        await newPage.close();
      });
      let products = [];
      for(link in urls.get()){
        let currentPageData = await pagePromise(urls[link]);
        products.push(currentPageData);
        console.log(currentPageData);
    }
      resolve(products);
      // const products = totalItem.map((index, value) => ({
      //   remoteId: common.getIdProduct(store.name, $(value).attr('href')),
      //   storeId: new ObjectID(store.id),
      //   rootCategoryId: new ObjectID(rootCategory.id),
      //   url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
      //   image: store.headers.Referer + $(value).find(store.dataCrawlProduct.image).find('img').attr('src').substring(1) || config.crawler.defaultName,
      //   name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
      //   price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   brand: config.crawler.defaultName,
      //   type: config.crawler.defaultName
      // }))
      // resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Tiki = (storeId, rootCategoryId, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ _id: rootCategoryId });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({  _id: storeId });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://tiki.vn/thoi-trang-nam/c915?src=c.915.hamburger_menu_fly_out_banner';
      const pageContent = await common.getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const urls = totalItem.map((index, value) => (
        store.headers.Referer + $(value).attr('href') || config.crawler.defaultName
      ))
      const browser = await puppeteer.launch({ headless: false,args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true });
      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitFor(10000);
        dataObj['remoteId'] = link.substring(link.length - 10) || config.crawler.defaultName;
        dataObj['storeId'] = new ObjectID(store.id);
        dataObj['rootCategoryId'] = new ObjectID(rootCategory.id);
        dataObj['url'] = link || config.crawler.defaultName; 
        dataObj['image'] = common.getUrlImage(await newPage.$eval(store.dataCrawlProduct.image, text => text.outerHTML))|| config.crawler.defaultName;
        dataObj['name'] = await newPage.$eval(store.dataCrawlProduct.name, text => text.textContent)|| config.crawler.defaultName;
        dataObj['price'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMin'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMax'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['detail'] = await newPage.$eval(store.dataCrawlProduct.detail, text => text.textContent)|| config.crawler.defaultName; 
        dataObj['brand'] = config.crawler.defaultName;
        dataObj['type'] = config.crawler.defaultName;
        resolve(dataObj);
        await newPage.close();
      });
      let products = [];
      for(link in urls.get()){
        let currentPageData = await pagePromise(urls[link]);
        products.push(currentPageData);
        console.log(currentPageData);
    }
      resolve(products);
      // const products = totalItem.map((index, value) => ({
      //   remoteId: common.getIdProduct(store.name, $(value).attr('href')) || config.crawler.defaultName,
      //   storeId: new ObjectID(store.id),
      //   rootCategoryId: new ObjectID(rootCategory.id),
      //   url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
      //   image: $(value).find(store.dataCrawlProduct.image).find('img').attr('src') || config.crawler.defaultName,
      //   name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
      //   price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   brand: config.crawler.defaultName,
      //   type: config.crawler.defaultName
      // }))
      // resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Lazada = (storeId, rootCategoryId, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ _id: rootCategoryId });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({  _id: storeId });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://www.lazada.vn/trang-phuc-nam/?spm=a2o4n.home.cate_9.1.1905e182FUSa4Y';
      const pageContent = await common.getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const urls = totalItem.map((index, value) => (
        store.headers.Referer + $(value).find('a').attr('href').substring(15) || config.crawler.defaultName
      ))
      const browser = await puppeteer.launch({ headless: false,args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true });
      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitFor(10000);
        dataObj['remoteId'] = link.substring(link.length - 10) || config.crawler.defaultName;
        dataObj['storeId'] = new ObjectID(store.id);
        dataObj['rootCategoryId'] = new ObjectID(rootCategory.id);
        dataObj['url'] = link || config.crawler.defaultName; 
        dataObj['image'] = common.getUrlImage(await newPage.$eval(store.dataCrawlProduct.image, text => text.outerHTML))|| config.crawler.defaultName;
        dataObj['name'] = await newPage.$eval(store.dataCrawlProduct.name, text => text.textContent)|| config.crawler.defaultName;
        dataObj['price'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMin'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['priceMax'] = await newPage.$eval(store.dataCrawlProduct.price, text => text.textContent)|| config.crawler.defaultName;
        dataObj['detail'] = await newPage.$eval(store.dataCrawlProduct.detail, text => text.textContent)|| config.crawler.defaultName; 
        dataObj['brand'] = config.crawler.defaultName;
        dataObj['type'] = config.crawler.defaultName;
        resolve(dataObj);
        await newPage.close();
      });
      let products = [];
      for(link in urls.get()){
        let currentPageData = await pagePromise(urls[link]);
        products.push(currentPageData);
        console.log(currentPageData);
    }
      resolve(products);
      // const products = totalItem.map((index, value) => ({
      //   remoteId: common.getIdProduct(store.name, $(value).find('a').attr('href')) || config.crawler.defaultName,
      //   storeId: new ObjectID(store.id),
      //   rootCategoryId: new ObjectID(rootCategory.id),
      //   url: store.headers.Referer + $(value).find('a').attr('href').substring(15) || config.crawler.defaultName,
      //   image: $(value).find(store.dataCrawlProduct.image).find('img').attr('src') || config.crawler.defaultName,
      //   name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
      //   price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
      //   brand: config.crawler.defaultName,
      //   type: config.crawler.defaultName
      // }))
      // resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};


