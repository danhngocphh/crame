const { Router } = require('express');

const fs = require('fs');
const path = require('path');
const logger = require('../infrastructure/logger');
let routes = Router();

const loadRoutes = () => {
  fs.readdirSync(__dirname)
    .filter((directory) =>
      fs.lstatSync(path.join(__dirname, directory)).isDirectory()
    )
    .forEach((directory) => {
      fs.readdirSync(path.join(__dirname, directory))
        .filter((file) => file.indexOf('.') !== 0 && file.endsWith('.route.js'))
        .forEach((file) => {
          const childRoute = require(path.join(__dirname, directory, file));
          routes.use(`/${file.slice(0, -9)}`, childRoute);
        });
    });
  logger.info(`[Routes] Load routes successfully`);
  return routes;
};

module.exports = loadRoutes;
