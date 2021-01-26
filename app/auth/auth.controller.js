const bcrypt = require('bcrypt');

const config = require('../../config');
const { ActionResponse, APIError } = require('../../helpers');
const { user: UserModel } = require('../../infrastructure/database/models');
const logger = require('../../infrastructure/logger');
const { jwtService, emailService } = require('../../infrastructure/services');

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
      const [access_token, refresh_token] = await Promise.all([
        jwtService.genAccessToken(userFound.id),
        jwtService.genRefreshToken(userFound.id),
      ]);
      logger.debug(`All token of user ${userFound.email} is generated : %o`, {
        access_token,
        refresh_token,
      });
      actionResponse.createdDataSuccess({ access_token, refresh_token });
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
      const [access_token, refresh_token] = await Promise.all([
        jwtService.genAccessToken(userCreated.id),
        jwtService.genRefreshToken(userCreated.id),
        userCreated.save(),
      ]);
      actionResponse.createdDataSuccess({
        access_token,
        refresh_token,
        userId: userCreated.id,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { refreshToken } = req.body;
      const { id } = await jwtService.verifyRefreshToken(refreshToken);
      const access_token = await jwtService.genAccessToken(id);
      actionResponse.createdDataSuccess({ access_token });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { refreshToken } = req.body;
      const { id } = await jwtService.verifyRefreshToken(refreshToken);
      await jwtService.removeRefreshToken(id, refreshToken);
      actionResponse.createdDataSuccess();
    } catch (error) {
      next(error);
    }
  },
  confirm: async (req, res, next) => {
    const actionResponse = new ActionResponse(res);
    const info = await emailService.sendMail();
    actionResponse.getDataSucces({ info });
  },
  forgetPassword: async (req, res, next) => {},
  refreshPassword: async (req, res, next) => {},
};

module.exports = AuthController;
