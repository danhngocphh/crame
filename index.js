const http = require('http');
const https = require('https');
const config = require('./config');
const logger = require('./system/logger');
const loadSystem = require('./system');
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
    await loadSystem();
    const app = loadApp();

    const server = config.https ? createHttp(app) : createHttps(app);
    server.listen(config.port, (err) => {
      const port = config.port;
      if (err) {
        logger.error(`[Server] Listen failed on port : ${port}`);
        process.exit(1);
      }
      logger.info(`[Server] Listen successfully on port : ${port}`);
    });
  } catch (error) {
    logger.error(error.stack);
  }
};

main();
