const { Router } = require('express');
const UserController = require('./user.controller');
const Middleware = require('../middlewares');
const UserSchema = require('./user.schema');
const UserService = require('./user.service');

const route = Router();


/* Handle current user */
route.get('/me', Middleware.isAuth, UserController.getMe);
route.put(
  '/me',
  Middleware.isAuth,
  UserService.uploadAvatar,
  Middleware.isValidate(UserSchema.updateMePUT),
  UserController.updateMe
);
route.put(
  '/me/change-password',
  Middleware.isAuth,
  Middleware.isValidate(UserSchema.changeMyPasswordPUT),
  UserController.changeMyPassword
);
/* Handle users */
route.get('/', Middleware.isAuth, UserController.getAll);

module.exports = route;
