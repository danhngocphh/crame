let axios = require('axios').default;
const { APIError } = require('../../../helpers');
const config = require('../../../config');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
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
            const data = await axios.get(
                store.dataCallAPI.urlHeader + categoryId + store.dataCallAPI.urlMiddle + limit,
                {
                  headers: {
                    'Referer': store.url
                  }
                }
              );
              const products =  _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID(store.id),
                rootCategoryId: new ObjectID(rootCategory.id),
                url: store.dataCallAPI.urlProduct + o.category_path,
                image: o.image,
                name: o.name,
                price: o.sale_price_min,
                priceMin: o.sale_price_min,
                priceMax: o.sale_price_max,
                brand: "...",
                type: o.product_type.toString()
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
            const params =  store.params;
            params.category = categoryId;
            params.limit = limit;
            const data = await axios.get(
                store.url.product,
                {
                    headers: store.headers,
                    params: params
                }
            );
            const products = _.map(data.data.data, o => ({
                remoteId: o.id,
                storeId: new ObjectID(store.id),
                rootCategoryId: new ObjectID(rootCategory.id),
                url: store.dataCallAPI.urlProduct + o.id,
                image: o.thumbnail_url,
                name: o.name,
                price: o.price,
                priceMin: o.price,
                priceMax: o.price,
                brand: o.brand_name,
                type: o.type
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