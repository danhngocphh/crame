const Agenda = require('agenda');
const logger = require('../logger');
const config = require('../../config');
let agenda;

module.exports = {
  start: async ({ mongoDb }) => {
    try {
      agenda = new Agenda({
        mongo: mongoDb,
        db: {
          collection: config.cronjobs.collection,
        },
        processEvery: config.cronjobs.pooltime,
        maxConcurrency: config.cronjobs.concurrency,
      });
      await agenda.start();
      logger.info(`[Cronjob] Load agenda successfully`);
    } catch (error) {
      logger.error(`[Cronjob] Load agenda failed %o`, err);
      throw error;
    }
  },
  get: () => agenda,
};
