const axios = require('axios').default;
const { ActionResponse, APIError } = require('../../helpers');
const { product: ModelProduct } = require('../../infrastructure/database/models');
const _ = require('lodash')

const CrawlController = {
  getCategorylist_Shopee: async () => {
    try {
      const { data } = await axios.get(
        'https://shopee.vn/api/v2/category_list/get?match'
      );
      // console.log(data.data.category_list.length);
      return data.data.category_list;
    } catch (error) {
      console.log(error);
    }
  },
  getapiProduct_Shopee: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const data = await axios.get(
        'https://shopee.vn/api/v2/search_items/?by=pop&match_id=' + dataReq.categoryid + '&order=desc&page_type=search&limit='+ dataReq.limit +'&version=2',
        {
          headers: {
            'Referer': 'https://shopee.vn'
          }
        }
      );
      const _products =  _.map(data.data.items, o => ({
        id: o.itemid,
        storeid: "shopee",
        categoryid: "shopee_" + dataReq.categoryid,
        slug: "...",
        url: "https://shopee.vn/product/" + o.shopid + "/" + o.itemid,
        image: "https://cf.shopee.vn/file/" + o.image,
        name: o.name,
        price: o.price,
        pricemin: o.price_min,
        pricemax: o.price_max,
        brand: o.brand,
        type: o.item_type
      }))
      _.map(_products, async o => {
          const produFound = await ModelProduct.findOne({ id: o.id });
          if(!produFound){
            let _creatProducts = new ModelProduct(o);
            _creatProducts.save();
          }
      })
      actionResponse.getDataCrawled(_products, "shoppe", dataReq.categoryid);
    } catch (error) {
      console.log(error);
    }
  },
  getapiProduct_Tiki: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const data = await axios.get(
        'https://tiki.vn/api/v2/products?category=' + dataReq.categoryid + '&limit='+ dataReq.limit,
        {
          headers: {
            'Referer': 'https://tiki.vn'
          }
        }
      );
      const _products =  _.map(data.data.data, o => ({
        id: o.id,
        storeid: "tiki",
        categoryid: "tiki_" + dataReq.categoryid,
        slug: "...",
        url: "http://tiki.vn/product/" + o.id ,
        image: o.thumbnail_url,
        name: o.name,
        price: o.price,
        pricemin: o.price,
        pricemax: o.price,
        brand: o.brand_name,
        type: o.type
      }))
      _.map(_products, async o => {
          const produFound = await ModelProduct.findOne({ id: o.id });
          if(!produFound){
            let _creatProducts = new ModelProduct(o);
            _creatProducts.save();
          }
      })
      actionResponse.getDataCrawled(_products, "tiki", dataReq.categoryid);
    } catch (error) {
      console.log(error);
    }
  },
  getapiProduct_Sendo: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const data = await axios.get(
        'https://searchlist-api.sendo.vn/web/categories/' + dataReq.categoryid + '/products?listing_algo=algo13&page=1&platform=web&size='+ dataReq.limit,
        {
          headers: {
            'Referer': 'https://www.sendo.vn/'
          }
        }
      );
      const _products =  _.map(data.data.data, o => ({
        id: o.id,
        storeid: "sendo",
        categoryid: "sendo_" + dataReq.categoryid,
        slug: "...",
        url: "https://www.sendo.vn/" + o.category_path,
        image: o.image,
        name: o.name,
        price: o.sale_price_min,
        pricemin: o.sale_price_min,
        pricemax: o.sale_price_max,
        brand: "...",
        type: o.product_type
      }))
      _.map(_products, async o => {
          const produFound = await ModelProduct.findOne({ id: o.id });
          if(!produFound){
            let _creatProducts = new ModelProduct(o);
            _creatProducts.save();
          }
      })
      actionResponse.getDataCrawled(_products, "sendo", dataReq.categoryid);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
