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

  createdDataSuccess(data) {
    return this.res.status(201).json({
      success: true,
      title: this.title,
      data,
    });
  }
}

module.exports = ActionResponse;
