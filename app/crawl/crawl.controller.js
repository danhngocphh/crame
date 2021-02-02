const { ActionResponse } = require('../../helpers');
const { product: ModelProduct } = require('../../infrastructure/database/models');
const { scraperAPI } = require('../../infrastructure/services');
const _ = require('lodash');


const CrawlController = {
  add_API_Product_Shopee: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await scraperAPI.getapiProduct_Shopee(dataReq.categoryid,dataReq.limit);
      if(_products.length > 0){
        await _.map(_products, o => {
          ModelProduct.findOne({ idremoteId: o.id }).then((result)=>{
            if(!result){
              let _creatProducts = new ModelProduct(o);
              _creatProducts.save();
            }
          });
      })
      actionResponse.getDataCrawled(_products, "shoppe", dataReq.categoryid);
      }else{
        actionResponse.getDataFalse("shopee", dataReq.categoryid)
      }
    } catch (error) {
      console.log(error);
    }
  },
  add_API_Product_Tiki: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await scraperAPI.getapiProduct_Tiki(dataReq.categoryid,dataReq.limit);
      if(_products.length > 0){
        await _.map(_products, o => {
          ModelProduct.findOne({ remoteId: o.id }).then((result)=>{
            if(!result){
              let _creatProducts = new ModelProduct(o);
              _creatProducts.save();
            }
          });
      })
      actionResponse.getDataCrawled(_products, "tiki", dataReq.categoryid);
      }else{
        actionResponse.getDataFalse("tiki", dataReq.categoryid)
      }
    } catch (error) {
      console.log(error);
    }
  },
  add_API_Product_Sendo: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      const _products = await scraperAPI.getapiProduct_Sendo(dataReq.categoryid,dataReq.limit);
      if(_products.length > 0){
        await _.map(_products, o => {
          ModelProduct.findOne({ remoteId: o.id }).then((result)=>{
            if(!result){
              let _creatProducts = new ModelProduct(o);
              _creatProducts.save();
            }
          });
      })
      actionResponse.getDataCrawled(_products, "sendo", dataReq.categoryid);
      }else{
        actionResponse.getDataFalse("sendo", dataReq.categoryid)
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
