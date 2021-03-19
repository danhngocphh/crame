const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const logger = require('../infrastructure/logger');
const config = require('../config');
const { APIError } = require('../helpers');
const mongoose = require('mongoose');
const { regex } = require('../config');

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
  // NoSQL injections
  app.use((res, req, next) => {
    const sanitize = (object) => {
      if (_.isObject(object)) {
        _.forEach(object, (value, key) => {
          if (/^\$/.test(key)) _.unset(object, key);
          else sanitize(value);
        });
      }
      return object;
    };
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);
    req.query = sanitize(req.query);
    next();
  });
  app.use(config.api.prefix, route);
  app.use('*', (req, res, next) => {
    next(
      new APIError(
        `Cant not found ${req.originalUrl} in this server`,
        config.httpStatus.NotFound
      )
    );
  });
  app.use((err, req, res, next) => {
    /* mongoose handle error start */
    if (err instanceof mongoose.Error.CastError) {
      err.status = 404;
      err.message = 'Data was not found';
    }
    if (err.code === 11000) {
      err.status = 400;
      err.details = _.reduce(
        err.keyValue,
        (acc, value, field) => ({
          ...acc,
          [field]: `${field} đã tồn tại với giá trị ${value}. Hãy thử một giá trị khác`,
        }),
        {}
      );
      err.message = `Duplicate value`;
    }
    if (err instanceof mongoose.Error.ValidationError) {
      err.status = 400;
      err.details = _.reduce(
        err.errors,
        (acc, { path, message }) => ({
          ...acc,
          [path]: message,
        }),
        {}
      );
    }
    /* mongoose handle error end */
    if (!err.status) logger.error('[Server] Error !!! %o', err);
    return res.status(err.status || 500).json({
      success: false,
      message: _.get(err, 'message', 'Server Error'),
      details: _.get(err, 'details', undefined),
    });
  });

  return app;
};

module.exports = loadExpress;
