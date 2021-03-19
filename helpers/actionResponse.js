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
      data,
    });
  }

  getPaginateDataSuccess(data, { totalDocs, totalPages, page }) {
    return this.res.status(200).json({
      success: true,
      title: this.title,
      data,
      total : totalDocs,
      currentPage : page,
      totalPages,
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
}

module.exports = ActionResponse;
