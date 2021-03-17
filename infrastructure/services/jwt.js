const jwt = require('jsonwebtoken');
const config = require('../../config');
const { APIError } = require('../../helpers');
const loadRedisClient = require('../cache');
const logger = require('../logger');

const { token: tokenConfig } = config;
const redisClient = loadRedisClient.get();

// clear all data in redis
// redisClient.flushall();

exports.genAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: userId,
    };
    const option = {
      expiresIn: tokenConfig.access_expired,
    };
    jwt.sign(payload, tokenConfig.access_secret, option, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenConfig.access_secret, (err, payload) => {
      if (err)
        reject(new APIError(err.message, config.httpStatus.Unauthorized));
      resolve(payload);
    });
  });
};

exports.genRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: userId,
    };
    const option = {
      expiresIn: tokenConfig.refresh_expired,
    };
    jwt.sign(
      payload,
      tokenConfig.refresh_secret,
      option,
      async (err, token) => {
        try {
          if (err) reject(err);
          await redisClient.rpush(payload.id, token);
          const storedRefreshTokens = await redisClient.lrange(payload.id, 0, -1);
          logger.debug(
            `All refresh token of userid ${payload.id} : %o`
          , storedRefreshTokens);
          resolve(token);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

exports.verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenConfig.refresh_secret, async (err, payload) => {
      try {
        if (err) {
          if(payload && payload.id) await redisClient.lrem(payload.id, 1, token)
          reject(new APIError(err.message, config.httpStatus.Unauthorized));
        } else {
          const storedRefreshTokens = await redisClient.lrange(payload.id, 0, -1);
          if (!storedRefreshTokens.includes(token))
            reject(
              new APIError('You had logout', config.httpStatus.Unauthorized)
            );
          logger.debug(
            `storedRefreshTokens of ${payload.id} : %o`, storedRefreshTokens
          );
          resolve(payload);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

exports.removeRefreshToken = async (userId, token) => {
  await redisClient.lrem(userId, 1, token);
};

exports.genEmailToken = ({email, id}) => {
  return new Promise((resolve, reject) => {
    const payload = {email, id};
    const option = {
      expiresIn: tokenConfig.email_expired,
    };
    jwt.sign(payload, tokenConfig.email_secret, option, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.verifyEmailToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenConfig.email_secret, (err, payload) => {
      if (err)
        reject(new APIError('Liên kết không hợp lệ', config.httpStatus.BadRequest));
      resolve(payload);
    });
  });
};

