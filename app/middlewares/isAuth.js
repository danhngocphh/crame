const config = require('../../config');
const { user: userModel } = require('../../infrastructure/database/models');
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
    const currentUser = await userModel.findById(id);
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
