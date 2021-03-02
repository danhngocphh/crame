const { ActionResponse } = require('../../helpers');
const { user: UserModel } = require('../../infrastructure/database/models');

const UserController = {
  getMe: (req, res, next) => {
    const actionResponse = new ActionResponse(res);
    return actionResponse.getDataSuccess({ ...req.currentUser });
  },
  updateMe: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        currentUser: { _id },
        body: { avatar, ...updateData },
      } = req;
      console.log(req.file);
      const { password, ...result } = (
        await UserModel.findByIdAndUpdate(
          _id,
          {
            $set: updateData,
          },
          { new: true, runValidators: true }
        ).exec()
      ).toObject();
      return actionResponse.createdDataSuccess({ ...result });
    } catch (error) {
      next(error);
    }
  },
  getAll: (req, res, next) => {
    const actionResponse = new ActionResponse(res);
    return actionResponse.getDataSuccess({});
  },
};

module.exports = UserController;
