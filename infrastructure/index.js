const loadMongoDb = require('./database');
const loadRedisClient = require('./cache');
const loadCronjob = require('./cronjobs');

const loadInfrastructure = async () => {
  const mongoDb = await loadMongoDb();
  loadRedisClient.start();
  //Handle mongoDb in cronjob after
  await loadCronjob.start({ mongoDb });
};

module.exports = loadInfrastructure;
