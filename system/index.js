const loadMongoDb = require('./database');

const loadSystem = async () => {
    const mongoDb = await loadMongoDb();
    //Handle mongoDb in cronjob after
}

module.exports = loadSystem;