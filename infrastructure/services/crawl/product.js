const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models')


exports.Shopee = (storeName, nameRootCategory, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({ name: storeName });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://shopee.vn/Th%E1%BB%9Di-Trang-Nam-cat.78';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const products = totalItem.map((index, value) => ({
        remoteId: $(value).find('a').attr('href').substring($(value).find('a').attr('href').length - 10) || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).find('a').attr('href') || config.crawler.defaultName,
        image: $(value).find(store.dataCrawlProduct.image).find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
        price: Number($(value).find(store.dataCrawlProduct.price).text()) || 0,
        priceMin: Number($(value).find(store.dataCrawlProduct.price).text()) || 0,
        priceMax: Number($(value).find(store.dataCrawlProduct.price).text()) || 0,
        brand: config.crawler.defaultName,
        type: config.crawler.defaultName
      }))
      resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Sendo = (storeName, nameRootCategory, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({ name: storeName });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://www.sendo.vn/thoi-trang-nam/';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const products = totalItem.map((index, value) => ({
        remoteId: getId(storeName ,$(value).attr('href')),
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
        image: store.headers.Referer + $(value).find(store.dataCrawlProduct.image).find('img').attr('src').substring(1) || config.crawler.defaultName,
        name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
        price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        brand: config.crawler.defaultName,
        type: config.crawler.defaultName
      }))
      resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Tiki = (storeName, nameRootCategory, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({ name: storeName });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://tiki.vn/thoi-trang-nam/c915?src=c.915.hamburger_menu_fly_out_banner';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const products = totalItem.map((index, value) => ({
        remoteId: getId(storeName, $(value).attr('href')) || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
        image: $(value).find(store.dataCrawlProduct.image).find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
        price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        brand: config.crawler.defaultName,
        type: config.crawler.defaultName
      }))
      resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

exports.Lazada = (storeName, nameRootCategory, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      if (!rootCategory) {
        reject(new APIError(config.crawler.nullRootCategory, config.httpStatus.BadRequest));
      }
      const store = await StoreModel.findOne({ name: storeName });
      if (!store) {
        reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
      }
      // const url = 'https://www.lazada.vn/trang-phuc-nam/?spm=a2o4n.home.cate_9.1.1905e182FUSa4Y';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $(store.dataCrawlProduct.totalItem);
      const products = totalItem.map((index, value) => ({
        remoteId: getId(storeName, $(value).find('a').attr('href')) || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).find('a').attr('href').substring(15) || config.crawler.defaultName,
        image: $(value).find(store.dataCrawlProduct.image).find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find(store.dataCrawlProduct.name).text() || config.crawler.defaultName,
        price: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find(store.dataCrawlProduct.price).text()) || config.crawler.defaultName,
        brand: config.crawler.defaultName,
        type: config.crawler.defaultName
      }))
      resolve(products.get());
    } catch (error) {
      reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
  })
};

const getId = (storeName, value) => {
  if (storeName == "sendo" || storeName == "tiki") {
      const str = value != undefined ? value.split(".") : ['', ''];
      const result = str[0].substring(str[0].length - 8); 
      return result
  } else if(storeName == "lazada"){
    const str = value != undefined ? value.split(".") : ['', ''];
    const result = str[0].substring(str[0].length - 10); 
    return result
  } else{
    return config.crawler.defaultName
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