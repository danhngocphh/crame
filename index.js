const http = require('http');
const https = require('https');

const config = require('./config');
const logger = require('./infrastructure/logger');
const loadInfrastructure = require('./infrastructure');
const loadApp = require('./app');

const createHttp = (app) => {
  const server = http.createServer(app);
  return server;
};

const createHttps = (app) => {
  const options = {
    key: '',
    cert: '',
  };
  const server = https.createServer(options, app);
  return server;
};
const main = async () => {
  try {
    await loadInfrastructure();
    const app = loadApp();

    const server = config.https ? createHttp(app) : createHttps(app);
    const { port } = config;
    server.listen(config.port, (err) => {
      if (err) {
        logger.error(`[Server] Listen failed on port : ${port} %o`, err);
        process.exit();
      }
      logger.info(`[Server] Listen successfully on port : ${port}`);
    });
  } catch (error) {
    logger.error(error.stack);
    process.exit();
  }
};

main();
