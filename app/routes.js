const { Router } = require('express');
const fs = require('fs');
const path = require('path')
const route = Router();

fs.readdirSync(__dirname)
  .filter(directory => fs.lstatSync(path.join(__dirname, directory)).isDirectory())
  .forEach((directory) => {
    fs.readdirSync(path.join(__dirname, directory))
        .filter(file => file.indexOf('.') !== 0 && file.endsWith('.route.js'))
        .forEach((file) => {
                const childRoute = require(path.join(__dirname, directory , file));
                route.use(`/${file.slice(0, -9)}`, childRoute);
            });
  });

module.exports = route;