const { Router } = require('express');
const UserController = require('./user.controller');
const Middleware = require('../middlewares');

const route = Router();

route.get('/me', Middleware.isAuth, UserController.getMe);

module.exports = route;
