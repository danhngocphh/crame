const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../logger');

const loadMongoDb = async () => {
  require('./plugins')(mongoose);
  const uri = config.database.uri;
  try {
    const { connection } = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info(`[Database] Load database successfully on uri : ${uri}`);
    return connection.db;
  } catch (error) {
    logger.error(`[Database] Load database failed on uri : ${uri} %o`, error);
    throw error;
  }
};

module.exports = loadMongoDb;
