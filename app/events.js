const { EventEmitter } = require('events');
const logger = require('../system/logger');
let eventEmitter;

module.exports = {
  start: () => {
    ventEmitter = new EventEmitter();
    logger.info('[Events] Load events successfully');
  },
  get: () => eventEmitter,
};
