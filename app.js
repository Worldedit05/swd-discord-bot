if (process.env.PRODUCTION !== 'production') {
  require('dotenv').config();
}

const { logger } = require('./src/helper/logger');

const databaseConnection = require('./src/database');
// Get Discord client
require('./src/client');

const successfulDbConnection = databaseConnection();

function gracefulShutdown(){
  successfulDbConnection.close(false, () => {
    logger.info('Mongoose default connection disconnected through app termination');
  });
}

process.on('exit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', gracefulShutdown);
