const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../logger');

require('./models');

const loadMongoDb = async () => {
  const uri = config.database.uri
  try {
    const { connection } = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info(`[Database] Connected successfully on uri : ${uri}`);
    process.on('SIGINT', async () => {
      mongoose.connection.close()
      process.exit(1);
    });
    return connection.db;
  } catch (error) {
    logger.error(`[Database] Connected failed on uri : ${uri}`);
    throw error;
  }
}

module.exports = loadMongoDb;
