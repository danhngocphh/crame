const _ = require('lodash');
const config = require('../../config');
const { APIError } = require('../../helpers');
const logger = require('../../infrastructure/logger');

const isValidate = (schema, property = 'body') => (req, res, next) => {
  if(!req[property]) next(new APIError('Invalid property of request', config.httpStatus.BadRequest));
  const { error } = schema.validate(req[property], { abortEarly: false });
  if (error) {
    const details = _.reduce(
      error.details,
      (acc, { message, path }) => ({
        [_.replace(path, ',', '.')]: message,
        ...acc,
      }),
      {}
    );
    next(new APIError(error.message, config.httpStatus.BadRequest, details));
  } else {
    next();
  }
};

module.exports = isValidate;
