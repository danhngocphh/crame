const { EventEmitter } = require('events');
const logger = require('../infrastructure/logger');
let eventEmitter;

module.exports = {
  start: () => {
    ventEmitter = new EventEmitter();
    logger.info('[Events] Load events successfully');
  },
  get: () => eventEmitter,
};
