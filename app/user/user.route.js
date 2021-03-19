const { Router } = require('express');
const UserController = require('./user.controller');
const UserSchema = require('./user.schema');
const UserService = require('./user.service');
const Middleware = require('../middlewares');

const route = Router();

route.all('*', Middleware.isAuth);
/* Handle current user */

route
  .route('/me')
  .get(UserController.getMe)
  .put(
    UserService.uploadAvatar,
    Middleware.isValidate(UserSchema.updateMePUT),
    UserController.updateMe
  );
route.put(
  '/me/change-password',
  Middleware.isValidate(UserSchema.changeMyPasswordPUT),
  UserController.changeMyPassword
);

/* Handle users */

route.param('userId', UserService.findUserById);

route
  .route('/')
  .post(
    Middleware.isValidate(UserSchema.createUserPOST),
    UserController.createOne
  )
  .get(Middleware.attachPaginateOptions, UserController.getAll);

route
  .route('/:userId')
  .get(UserController.getById)
  .put(
    Middleware.isValidate(UserSchema.updateUserPUT),
    UserController.updateOne
  )
  .delete(UserController.deleteOne);

module.exports = route;
