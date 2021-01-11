
const http = require('http');
const https = require('https');
const express = require('express');

const config = require('./config');
const logger = require('./system/logger');
require('./system')();

const app = require('./app')(express);

const createHttp = () => {
  const server = http.createServer(app);
  return server;
};

const createHttps = () => {
  const options = {
    key: '',
    cert: '',
  };
  const server = https.createServer(options, app);
  return server;
};

const server = config.https ? createHttp() : createHttps()

server.listen(config.port, (err) => {
  const port = config.port
  if (err) {
    logger.error(`[Server] Listen failed on port : ${port}`)
    process.exit(1);
  }
  logger.info(`[Server] Listen successfully on port : ${port}`)
});
