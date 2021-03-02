const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const logger = require('../infrastructure/logger');
const config = require('../config');
const { APIError } = require('../helpers');


const loadExpress = (route) => {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());
  app.use(
    morgan(config.logs.morganFormat, {
      stream: {
        write: (message) => logger.http(message),
      },
    })
  );
  app.use(config.api.prefix, route);
  // app.use(config.crawl.prefix, route);
  app.get('/crawl', (req, res, next) => {
    res.send('hello woed!!');
  });
  app.use('*', (req, res, next) => {
    next(
      new APIError(
        `Cant not found ${req.originalUrl} in this server`,
        config.httpStatus.NotFound
      )
    );
  });
  app.use((err, req, res, next) => {
    err.status ? {} : logger.error('[Server] Error !!! %o', err);
    return res.status(err.status || 500).json({
      success: false,
      message: _.get(err, 'message', 'Server Error'),
      details: _.get(err, 'details', undefined),
    });
  });

  return app;
};

module.exports = loadExpress;
