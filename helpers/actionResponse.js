const _ = require('lodash');
class ActionResponse {
  constructor(res) {
    this.res = res;
    this.title = 'Powered by T&N';
  }

  getDataSuccess(data) {
    return this.res.status(200).json({
      success: true,
      title: this.title,
      total: data.length,
      data,
    });
  }

  getPaginateDataSuccess(items, { totalDocs, page }) {
    return this.res.status(200).json({
      data: {
        pageOptions : {
          total : totalDocs,
          current : page,
        },
        items,
      },
      success: true,
      title: this.title,
    });
  }

  getDataCrawled(data, shopName, categoryId) {
    return this.res.status(200).json({
      success: true,
      msg: 'Crawled: ' + shopName + '_' + categoryId,
      data,
    });
  }

  getCategoryCrawled(data, shopName) {
    return this.res.status(200).json({
      success: true,
      msg: 'Crawled List Category : ' + shopName,
      data,
    });
  }

  createdDataSuccess(data) {
    return this.res.status(201).json({
      success: true,
      title: this.title,
      data,
    });
  }

  saveComplete(data) {
    return this.res.status(200).json({
      success: true,
      msg: 'Save complete!',
      data,
    });
  }

  
  setupCronjobComplete(data) {
    return this.res.status(200).json({
      success: true,
      msg: 'Setup Cronjob complete!',
      data,
    });
  }
}

module.exports = ActionResponse;
