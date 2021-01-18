const loadExpress = require('./express');
const loadEventEmitter = require('./events');
const loadRoutes = require('./routes');

const loadApp = () => {
  loadEventEmitter.start();
  const routes = loadRoutes();
  return loadExpress(routes);
};

module.exports = loadApp;
