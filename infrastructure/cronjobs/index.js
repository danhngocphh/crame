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
      // const jobTypes = ["category.crawl", "product.crawl"];
      const jobTypes = [];
      jobTypes.forEach(async (type) => {
        await require("./jobs/" + type)(agenda);
      });
      if (jobTypes.length) {
        await agenda.start();
        logger.info(`[Cronjob] Load agenda successfully:` + jobTypes);
      } else {
        logger.error(`[Cronjob] Load agenda failed: List job empty!`);
      }
    } catch (error) {
      logger.error(`[Cronjob] Load agenda failed %o`, error);
      throw error;
    }
  },
  get: () => agenda,
};

// agenda.processEvery("one minute");
// agenda.processEvery("1.5 minutes");
// agenda.processEvery("3 days and 4 hours");
// agenda.processEvery("3 days, 4 hours and 36 seconds");
