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
        throw new APIError('Invalid password', config.httpStatus.BadRequest, {
          password: `Password is invalid. Try another password`,
        });
      if (!userFound.isConfirmed) {
        throw new APIError('not-confirm', config.httpStatus.BadRequest, {
          email: `${userReq.email} chưa được kích hoạt. Vui lòng kích hoạt tài khoản`,
        });
      } else {
        const [access_token, refresh_token] = await Promise.all([
          jwtService.genAccessToken(userFound.id),
          jwtService.genRefreshToken(userFound.id),
        ]);
        logger.debug(`All token of user ${userFound.email} is generated : %o`, {
          access_token,
          refresh_token,
        });
        actionResponse.createdDataSuccess({
          access_token,
          refresh_token,
          isConfirmed: true,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: userReq } = req;
      const hashedPassword = await bcrypt.hash(userReq.password, saltRounds);
      const userFound = await UserModel.findOne({ email: userReq.email });
      if (userFound != null || userReq.email === config.email.user)
        throw new APIError('User already exists', config.httpStatus.BadRequest, {
          email: `${userReq.email} is existed. Try another email`,
        });
      const userCreated = new UserModel({
        ...userReq,
        password: hashedPassword,
        isConfirmed: false,
      });
      const [emailToken] = await Promise.all([
        jwtService.genEmailToken(userCreated),
        userCreated.save(),
      ]);
      actionResponse.createdDataSuccess({
        emailToken,
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
      logger.debug(`User ${id} logout`);
      await jwtService.removeRefreshToken(id, refreshToken);
      actionResponse.createdDataSuccess();
    } catch (error) {
      next(error);
    }
  },
  checkValidEmailToken: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { emailToken } = req.body;
      const { id } = await jwtService.verifyEmailToken(emailToken);
      const { email } = await UserModel.findById(id);
      actionResponse.createdDataSuccess({ email });
    } catch (error) {
      next(error);
    }
  },
  confirm: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { emailToken } = req.body;
      const { id } = await jwtService.verifyEmailToken(emailToken);
      const { password, ...result } = (
        await UserModel.findByIdAndUpdate(
          id,
          {
            isConfirmed: true,
          },
          { new: true }
        ).exec()
      ).toJSON();
      actionResponse.createdDataSuccess({ ...result });
    } catch (error) {
      next(error);
    }
  },
  resendConfirm: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { email } = req.body;
      const userFound = await UserModel.findOne({ email });
      if (userFound == null)
        throw new APIError('User not found', config.httpStatus.NotFound, {
          email: `${email} not exist. Try another email`,
        });
      if (userFound.isConfirmed)
        throw new APIError(
          `The ${email} is already confirm`,
          config.httpStatus.BadRequest,
          {
            email: `${email} is already confirm`,
          }
        );
      const emailToken = await jwtService.genEmailToken(userFound);
      await emailService.sendMailConfirmUser({
        email,
        emailToken,
      });
      actionResponse.createdDataSuccess({
        message: 'Email đã được gửi thành công bạn hãy kiểm tra email',
      });
    } catch (error) {
      next(error);
    }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { email } = req.body;
      const userFound = await UserModel.findOne({ email });
      if (userFound == null)
        throw new APIError('User not found', config.httpStatus.NotFound, {
          email: `${email} not exist. Try another email`,
        });
      const emailToken = await jwtService.genEmailToken(userFound);
      await emailService.sendMailForgetPassword({
        email,
        emailToken,
      });
      actionResponse.createdDataSuccess({
        message: 'Email đã được gửi thành công bạn hãy kiểm tra email',
      });
    } catch (error) {
      next(error);
    }
  },
  refreshPassword: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: userReq } = req;
      logger.debug("%o", userReq);
      const hashedPassword = await bcrypt.hash(userReq.password, saltRounds);
      const { id } = await jwtService.verifyEmailToken(userReq.emailToken);
      const { password, ...result } = (
        await UserModel.findByIdAndUpdate(
          id,
          {
            password: hashedPassword,
          },
          { new: true }
        ).exec()
      ).toJSON();
      actionResponse.createdDataSuccess({ ...result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
