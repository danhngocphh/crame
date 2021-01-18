const loadMongoDb = require('./database');
const loadRedisClient = require('./cache');

const loadSystem = async () => {
    const mongoDb = await loadMongoDb();
    loadRedisClient.start();
    //Handle mongoDb in cronjob after
}

module.exports = loadSystem;