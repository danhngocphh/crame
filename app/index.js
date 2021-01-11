const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('../system/logger');
const config = require('../config');
const _ = require('lodash');

var route = require('./routes');
const { APIError } = require('../helpers');

const loadExpressApp = (express) => {
  const app = express();
  app.set('trust proxy', true);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());
  app.use(
    morgan(config.logs.morganFormat, {
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
        config.httpStatus.NotFound
      )
    );
  });
  app.use((err, req, res, next) => {
    if (err.isJoi === true) {
      err.details = _.map(
        err.details,
        ({ context: { key, value }, message }) => {
          return {
            field: key,
            value,
            message,
          };
        }
      );
    }
    logger.error(err.stack);
    return res.status(err.status || 500).json({
      success: false,
      message: _.get(err, 'message', 'Server Error'),
      details: _.get(err, 'details', undefined),
    });
  });

  return app;
};

module.exports = loadExpressApp;
