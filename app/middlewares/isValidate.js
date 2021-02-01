const _ = require('lodash');
const config = require('../../config');
const { APIError } = require('../../helpers');

const isValidate = (schema, property = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: true });
  if (error) {
    const message = _.map(error.details, 'message').join(',');
    const details = _.map(
      error.details,
      ({ context: { key, value }, message }) => {
        return {
          field: key,
          value,
          message,
        };
      }
    );
    next(new APIError(message, config.httpStatus.BadRequest, details));
  } else {
    next();
  }
};

module.exports = isValidate;
