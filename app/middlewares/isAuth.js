const config = require('../../config');
const { user: userModel } = require('../../system/database/models');
const { jwtService } = require('../../system/services');

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
    const userFound = await userModel.findById(id);
    const currentUser = userFound.toObject();
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
