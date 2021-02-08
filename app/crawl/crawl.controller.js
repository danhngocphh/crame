const { ActionResponse, APIError } = require('../../helpers');
const { getProductAPI, saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');


const CrawlController = {
  callApiProduct: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      let _products;
      switch (dataReq.storename) {
        case "shopee":
          _products = await getProductAPI.Shopee(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
          break;
        case "tiki":
          _products = await getProductAPI.Tiki(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
          break;
        case "sendo":
          _products = await getProductAPI.Sendo(dataReq.storename, dataReq.namerootcategory, dataReq.categoryid, dataReq.limit);
          break;
      }
      if (_products.length > 0) {
        saveDB.product(_products);
        actionResponse.getDataCrawled(_products, dataReq.storename, dataReq.categoryid);
      } else {
        throw new APIError('Cant get product', config.httpStatus.BadRequest, {
          data: `Cant get product form ${dataReq.storename}_${dataReq.namerootcategory}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = CrawlController;
