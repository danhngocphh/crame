const _ = require('lodash');

class ActionReponse {
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

  error(error) {
    if (error.isJoi === true) {
      error.details = _.map(
        error.details,
        ({ context: { key, value }, message }) => {
          return {
            field: key,
            value,
            message,
          };
        }
      );
    }
    return this.res.status(error.status || 500).json({
      title: this.title,
      success: false,
      message: _.get(error, 'message', 'Server Error'),
      details: _.get(error, 'details', {}),
    });
  }
}

module.exports = ActionReponse;
