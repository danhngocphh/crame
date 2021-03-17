const _ = require('lodash');
const bcrypt = require('bcrypt');

const { ActionResponse, APIError } = require('../../helpers');
const { user: UserModel } = require('../../infrastructure/database/models');
const { imageService } = require('../../infrastructure/services');
const config = require('../../config');

const saltRounds = 10;

const UserController = {
  getMe: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const user = req.currentUser.toJSON();
      const avatarUrl = (
        await imageService.getResourceById(user.avatarPublicId)
      ).url;
      _.set(user, 'avatarUrl', avatarUrl);
      Reflect.deleteProperty(user, 'avatarPublicId');
      Reflect.deleteProperty(user, 'password');
      return actionResponse.getDataSuccess({ ...user });
    } catch (error) {
      next(error);
    }
  },
  updateMe: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: updateReq } = req;
      if (updateReq.avatarPublicId)
        await imageService.deleteResourceById(currentUser.avatarPublicId);
      const updatedUser = (
        await UserModel.findByIdAndUpdate(currentUser.id, updateReq, {
          new: true,
          runValidators: true,
        }).exec()
      ).toJSON();
      const avatarUrl = (
        await imageService.getResourceById(updatedUser.avatarPublicId)
      ).url;
      _.set(updatedUser, 'avatarUrl', avatarUrl);
      Reflect.deleteProperty(updatedUser, 'avatarPublicId');
      Reflect.deleteProperty(updatedUser, 'password');
      return actionResponse.createdDataSuccess({ ...updatedUser });
    } catch (error) {
      next(error);
    }
  },
  changeMyPassword: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        currentUser,
        body: { oldPassword, password },
      } = req;
      const verifyPassword = await bcrypt.compare(
        oldPassword,
        currentUser.password
      );
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (!verifyPassword)
        throw new APIError('Invalid password', config.httpStatus.BadRequest, {
          oldPassword: `Password is invalid. Try another password`,
        });
      const updatedUser = (
        await UserModel.findByIdAndUpdate(
          currentUser.id,
          {
            password: hashedPassword,
          },
          { new: true }
        ).exec()
      ).toJSON();
      const avatarUrl = (
        await imageService.getResourceById(updatedUser.avatarPublicId)
      ).url;
      _.set(updatedUser, 'avatarUrl', avatarUrl);
      Reflect.deleteProperty(updatedUser, 'avatarPublicId');
      Reflect.deleteProperty(updatedUser, 'password');
      return actionResponse.createdDataSuccess({ ...updatedUser });
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
