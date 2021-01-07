const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('../system/logger');
const config = require('../config');

const express = require('express');
var route = require('./routes');
const APIError = require('./shared/apiError');
const ActionReponse = require('./shared/response');
const { reject } = require('lodash');

const app = express();
const server = http.createServer(app);

class ExpressApp {
  constructor(port) {
    this.port = port;
  }

  addMiddlewares() {
    app.set('trust proxy', true);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(cors());
    app.use(
      morgan('dev', {
        stream: {
          write: (message) => logger.info(message),
        },
      })
    );
    app.use(config.api.prefix, route);
    app.use('*', (req, res, next) => {
      next(
        new APIError(
          `Cant not found ${req.originalUrl} in this server`,
          {},
          config.httpStatus.NotFound
        )
      );
    });

    app.use((err, req, res, next) => new ActionReponse(res).error(err));
  }

  listen() {
    return new Promise((resolve, reject) => {
      server.on('error', function (err) {
        reject(err);
        return;
      });
      app
        .listen(this.port)
        .once('listening', () => {
          logger.info(`Server is listening on ${this.port}`)
          resolve(true);
        })
        .once('error', reject);
    });
  }
}

module.exports = ExpressApp;
