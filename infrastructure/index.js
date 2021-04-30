const loadMongoDb = require('./database');
const loadRedisClient = require('./cache');

const loadInfrastructure = async () => {
  await loadMongoDb();
  loadRedisClient.start();
};

module.exports = loadInfrastructure;
