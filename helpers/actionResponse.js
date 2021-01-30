class ActionResponse {
  constructor(res) {
    this.res = res;
    this.title = 'Powered by T&N';
  }

  getDataSucces(data) {
    return this.res.status(200).json({
      success: true,
      title: this.title,
      data,
    });
  }

  getDataCrawled(data, _shopname, _categoryid) {
    return this.res.status(200).json({
      success: true,
      msg: "Crawled: " + _shopname +"_" +_categoryid,
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
}

module.exports = ActionResponse;
