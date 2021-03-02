const { Router } = require('express');
const UserController = require('./user.controller');
const Middleware = require('../middlewares');
const UserSchema = require('./user.schema');
const { uploadAvatar } = require('./demo-upload');

const route = Router();

route.get('/me', Middleware.isAuth, UserController.getMe);
route.put(
  '/me',
  uploadAvatar,
  Middleware.isAuth,
  Middleware.isValidate(UserSchema.updatePOST),
  UserController.updateMe
);

route.get('/', Middleware.isAuth, UserController.getAll);

module.exports = route;
