const _ = require('lodash');
const config = require('../../config');
const { APIError } = require('../../helpers');

const isValidate = (schema, property = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: false });
  if (error) {
    const message = _.map(error.details, 'message').join(',');
    console.log(error.details);
    const details = _.reduce(error.details, (acc, { message, path }) => {
      return {
        [_.replace(path, ',', '.')]: message,
        ...acc
      };
    }, {});
    next(new APIError(message, config.httpStatus.BadRequest, details));
  } else {
    next();
  }
};

module.exports = isValidate;
