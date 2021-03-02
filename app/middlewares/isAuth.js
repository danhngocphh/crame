const config = require('../../config');
const { APIError } = require('../../helpers');
const { user: userModel } = require('../../infrastructure/database/models');
const logger = require('../../infrastructure/logger');
const { jwtService } = require('../../infrastructure/services');

const getTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    const { id } = await jwtService.verifyAccessToken(token);
    const currentUser = await userModel.findById(id).lean();
    if(!currentUser.isConfirmed) next(new APIError("The user is not confirmed."), config.httpStatus.BadRequest);
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
