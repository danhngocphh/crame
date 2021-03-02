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
route.post(
  '/refresh-token',
  Middleware.isValidate(AuthSchema.refreshTokenPOST),
  AuthController.refreshToken
);
route.post(
  '/logout',
  Middleware.isValidate(AuthSchema.refreshTokenPOST),
  AuthController.logout
);
route.post(
  '/confirm',
  Middleware.isValidate(AuthSchema.confirmEmailPOST),
  AuthController.confirm
);
route.post(
  '/resend-confirm',
  Middleware.isValidate(AuthSchema.resendConfirmPOST),
  AuthController.resendConfirm
);
route.post(
  '/check-valid',
  Middleware.isValidate(AuthSchema.checkValidEmailTokenPOST),
  AuthController.checkValidEmailToken,
)
route.post(
  '/forget-password',
  Middleware.isValidate(AuthSchema.forgetPasswordPOST),
  AuthController.forgetPassword
);
route.post(
  '/refresh-password',
  Middleware.isValidate(AuthSchema.refreshPasswordPOST),
  AuthController.refreshPassword
);
module.exports = route;
