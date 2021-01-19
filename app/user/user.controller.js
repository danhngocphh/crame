const { ActionResponse } = require('../../helpers');

const UserController = {
  getMe: (req, res, next) => {
    const actionResponse = new ActionResponse(res);
    return actionResponse.getDataSucces({ currentUser: req.currentUser });
  },
};

module.exports = UserController;