const _ = require('lodash');
const bcrypt = require('bcrypt');

const { ActionResponse, APIError } = require('../../helpers');
const { user: UserModel } = require('../../infrastructure/database/models');
const { imageService } = require('../../infrastructure/services');
const config = require('../../config');
const UserService = require('./user.service');
const { httpStatus, email } = require('../../config');

const saltRounds = 10;

const UserController = {
  getMe: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const userJson = await UserService.toJson(req.currentUser);
      return actionResponse.getDataSuccess(userJson);
    } catch (error) {
      next(error);
    }
  },
  updateMe: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { currentUser, body: updateReq } = req;
      const updatedUser = await UserModel.findByIdAndUpdate(
        currentUser.id,
        { ...updateReq },
        {
          new: true,
          runValidators: true,
        }
      ).exec();
      const userJson = await UserService.toJson(updatedUser);
      return actionResponse.getDataSuccess(userJson);
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
      if (!verifyPassword)
        throw new APIError('Invalid password', config.httpStatus.BadRequest, {
          oldPassword: `Password is invalid. Try another password`,
        });
      const updatedUser = await UserModel.findByIdAndUpdate(
        currentUser.id,
        {
          password: await bcrypt.hash(password, saltRounds),
        },
        { new: true }
      ).exec();
      const userJson = await UserService.toJson(updatedUser);
      return actionResponse.getDataSuccess(userJson);
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        email: qEmail,
        phoneNumber: qPhoneNumber,
        fullName: qFullName,
        role: qRole,
      } = req.query;
      console.log(req.paginateOptions)
      const { docs: userRecords, ...rest } = await UserModel.paginate(
        {
          $and: [
            qEmail ? { email: { $regex: qEmail } } : {},
            qPhoneNumber ? { phoneNumber: { $regex: qPhoneNumber } } : {},
            qFullName ? { 'name.full': { $regex: qFullName } } : {},
            qRole ? { role: qRole } : {},
          ],
        },
        req.paginateOptions
      );
      const userJson = await UserService.toJson(userRecords);

      return actionResponse.getPaginateDataSuccess(userJson, rest);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { user: userRecord } = req;
      const actionResponse = new ActionResponse(res);
      const userJson = await UserService.toJson(userRecord);
      return actionResponse.getDataSuccess(userJson);
    } catch (error) {
      next(error);
    }
  },
  createOne: async (req, res, next) => {
    try {
      const { body: createReq } = req;
      const actionResponse = new ActionResponse(res);
      const newUser = new UserModel({
        ...createReq,
        password: await bcrypt.hash(createReq.password, saltRounds),
        isConfirmed: true,
      });
      await newUser.save();
      return actionResponse.getDataSuccess({ userId: newUser.id });
    } catch (error) {
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const { body: updateReq, user } = req;
      const actionResponse = new ActionResponse(res);
      await UserModel.findByIdAndUpdate(user.id, updateReq, { new: true });
      return actionResponse.getDataSuccess({ userId: user.id });
    } catch (error) {
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { user } = req;
      const actionResponse = new ActionResponse(res);
      await UserModel.findByIdAndRemove(user.id);
      return actionResponse.getDataSuccess();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
