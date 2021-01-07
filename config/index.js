const { BadRequest } = require('http-errors');

const result = require('dotenv').config();
if (result.error) {
  throw new Error('.env file not found');
}

module.exports = {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  logs: {
    level: process.env.LOG_LEVEL,
    morganFormat : process.env.MORGAN_FORMAT,
  },
  jwtSecret: process.env.JWT_SECRET,
  api: {
    prefix: '/api',
  },
  httpStatus: {
    Ok: 200,
    Created: 201,
    BadRequest: 400,
    NotFound: 404,
    ServerError: 500,
  }
};
