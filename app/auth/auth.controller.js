const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');
const { ActionResponse, APIError } = require('../../helpers');
const { user: UserModel } = require('../../system/database/models');

const saltRounds = 10;

const AuthController = {
  login: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: userReq } = req;
      const userFound = await UserModel.findOne({ email: userReq.email });
      if (userFound == null)
        throw new APIError('User not found', config.httpStatus.NotFound, {
          email: `${userReq.email} not exist. Try another email`,
        });
      const verifyPassword = await bcrypt.compare(
        userReq.password,
        userFound.password
      );
      if (!verifyPassword)
        throw new APIError('Invalid password', config.httpStatus.NotFound, {
          password: `${userReq.password} is invalid. Try another password`,
        });
      const token = jwt.sign(
        {
          id: userFound.id,
          email: userFound.email,
        },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpires,
        }
      );
      actionResponse.createdDataSuccess({ token });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: userReq } = req;
      const hasedPassword = await bcrypt.hash(userReq.password, saltRounds);
      const userCreated = new UserModel({
        ...userReq,
        password: hasedPassword,
        isConfirmed: true,
      });
      const token = jwt.sign(
        {
          id: userCreated.id,
          email: userCreated.email,
        },
        config.jwtSecret
      );
      await userCreated.save();
      actionResponse.createdDataSuccess({ token, userId : userCreated.id });
    } catch (error) {
      next(error);
    }
  },

  refreshPassword: async (req, res, next) => {},
};

module.exports = AuthController;
