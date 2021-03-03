let axios = require('axios').default;
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
      const store = await StoreModel.findOne({ name: storeName });
      // const url = 'https://shopee.vn/Th%E1%BB%9Di-Trang-Nam-cat.78';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.shopee-search-item-result__item');
      const products = totalItem.map((index, value) => ({
        remoteId: $(value).find('a').attr('href') || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url:  store.headers.Referer + $(value).find('a').attr('href') || config.crawler.defaultName,
        image: $(value).find('.customized-overlay-image').find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find('._1co5xN').text() || config.crawler.defaultName,
        price: Number($(value).find('._1xk7ak').text()) || 0,
        priceMin: Number($(value).find('._1xk7ak').text()) || 0,
        priceMax: Number($(value).find('._1xk7ak').text()) || 0,
        brand: "...",
        type: "..."
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
      const store = await StoreModel.findOne({ name: storeName });
      // const url = 'https://www.sendo.vn/thoi-trang-nam/';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.item_3x07');
      const products = totalItem.map((index, value) => ({
        remoteId: $(value).attr('href'),
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.url + $(value).attr('href') || config.crawler.defaultName,
        image: $(value).find('.image_3mnm').find('img').attr('src')  || config.crawler.defaultName,
        name: $(value).find('.truncateMedium_Tofh').text() || config.crawler.defaultName,
        price: parseInt($(value).find('.currentPrice_2hr9').text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find('.currentPrice_2hr9').text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find('.currentPrice_2hr9').text()) || config.crawler.defaultName,
        brand: "...",
        type: "..."
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
      const store = await StoreModel.findOne({ name: storeName });
      // const url = 'https://tiki.vn/thoi-trang-nam/c915?src=c.915.hamburger_menu_fly_out_banner';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.product-item');
      const products = totalItem.map((index, value) => ({
        remoteId: $(value).attr('href') || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
        image: $(value).find('.thumbnail').find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find('.name').text() || config.crawler.defaultName,
        price: parseInt($(value).find('.price-discount__price').text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find('.price-discount__price').text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find('.price-discount__price').text()) || config.crawler.defaultName,
        brand: "...",
        type: "..."
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
      const store = await StoreModel.findOne({ name: storeName });
      // const url = 'https://www.lazada.vn/trang-phuc-nam/?spm=a2o4n.home.cate_9.1.1905e182FUSa4Y';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.c2prKC');
      const products = totalItem.map((index, value) => ({
        remoteId: $(value).attr('href') || config.crawler.defaultName,
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: store.headers.Referer + $(value).attr('href') || config.crawler.defaultName,
        image: $(value).find('.cRjKsc').find('img').attr('src') || config.crawler.defaultName,
        name: $(value).find('.c16H9d').text() || config.crawler.defaultName,
        price: parseInt($(value).find('.c3gUW0').text()) || config.crawler.defaultName,
        priceMin: parseInt($(value).find('.c3gUW0').text()) || config.crawler.defaultName,
        priceMax: parseInt($(value).find('.c3gUW0').text()) || config.crawler.defaultName,
        brand: "...",
        type: "..."
      }))
      resolve(products.get());
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