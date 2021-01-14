const { Router } = require('express');
const AuthController = require('./auth.controller');
const Middleware = require('../middlewares');
const AuthSchema = require('./auth.schema');

const route = Router();

route.post(
  '/register',
  Middleware.isValidate(AuthSchema.registerPOST),
  AuthController.register
);
route.post(
  '/login',
  Middleware.isValidate(AuthSchema.loginPOST),
  AuthController.login
);

module.exports = route;
