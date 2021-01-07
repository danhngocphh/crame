const { Router } = require('express');
const response = require('../shared/response');
const HomeController = require('./home.controller');

const route = Router();

route.get('/', HomeController.get)
route.get('/error', HomeController.getError)

module.exports = route;