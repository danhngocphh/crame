const redis = require('async-redis');
const config = require('../../config');
const logger = require('../logger');

let redisClient;

module.exports = {
  start: () => {
    redisClient = redis.createClient(config.cache.uri);
    redisClient.on('error', function (err) {
      logger.error(
        `[Cache] Load redis client failed on uri : ${config.cache.uri}`
      );
    });
    process.on('SIGINT', () => {
      redisClient.quit();
    });
    logger.info(
      `[Cache] Load redis client successfully on uri : ${config.cache.uri}`
    );
  },
  get: () => redisClient,
};
