let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models')


exports.Shopee = (storeName, nameRootCategory, categoryId, limit) => {
  return new Promise( async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      const store = await StoreModel.findOne({ name: storeName });
      const url = 'https://shopee.vn/Th%E1%BB%9Di-Trang-Nam-cat.78';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.shopee-search-item-result__item');
      const products =  _.map(totalItem, (index, value) => ({
        remoteId: "Dang cap nhat",
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: $(value).attr('href').text(),  
        image: $(value).find('.customized-overlay-image').text(),
        name: $(value).find('._1co5xN').text(),
        price: $(value).find('._1xk7ak').text(),
        priceMin:  $(value).find('._1xk7ak').text(),
        priceMax:  $(value).find('._1xk7ak').text(),
        brand: "...",
        type: "..."
      }))
        resolve(products);
    } catch (error) {
        reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
})
};

exports.Sendo = (storeName, nameRootCategory, categoryId, limit) => {
  return new Promise( async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      const store = await StoreModel.findOne({ name: storeName });
      const url = 'https://www.sendo.vn/thoi-trang-nam/';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);  
      const totalItem = $('.card_3Vc8');
      const products =  _.map(totalItem, (index, value) => ({
        remoteId: "Dang cap nhat",
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: $(value).attr('href').text(),  
        image: $(value).find('.image_3mnm').find('img').attr('src'),
        name: $(value).find('.truncateMedium_Tofh').text(),
        price: $(value).find('.currentPrice_2hr9').text(),
        priceMin:  $(value).find('.currentPrice_2hr9').text(),
        priceMax:  $(value).find('.currentPrice_2hr9').text(),
        brand: "...",
        type: "..."
      }))
        resolve(products);
    } catch (error) {
        reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
})
};

exports.Tiki = (storeName, nameRootCategory, categoryId, limit) => {
  return new Promise( async (resolve, reject) => {
    try {
      const rootCategory = await rootCategoryModel.findOne({ name: nameRootCategory });
      const store = await StoreModel.findOne({ name: storeName });
      const url = 'https://tiki.vn/thoi-trang-nam/c915?src=c.915.hamburger_menu_fly_out_banner';
      const pageContent = await getPageContent(url);
      const $ = await cheerio.load(pageContent);
      const totalItem = $('.style__StyledItem-sc-18svp8n-0');
      const products =  _.map(totalItem, (index, value) => ({
        remoteId: "Dang cap nhat",
        storeId: new ObjectID(store.id),
        rootCategoryId: new ObjectID(rootCategory.id),
        url: $(value).attr('href').text(),  
        image: $(value).find('.thumbnail').find('img').attr('src'),
        name: $(value).find('.name').text(),
        price: $(value).find('.price-discount__price').text(),
        priceMin:  $(value).find('.price-discount__price').text(),
        priceMax:  $(value).find('.price-discount__price').text(),
        brand: "...",
        type: "..."
      }))
        resolve(products);
    } catch (error) {
        reject(new APIError(error.message, config.httpStatus.BadRequest));
    }
})
};

const getPageContent = async (url) => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      await autoScroll(page);
      return await page.content();
    } catch (err) {
      console.error(err);
    }
  };
  
  
  async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
  
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }