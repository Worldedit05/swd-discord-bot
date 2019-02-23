if (process.env.PRODUCTION !== 'production') {
  require('dotenv').config();
}

const { logger } = require('./src/helper/logger');

const databaseConnection = require('./src/database');
// Get Discord client
require('./src/client');

databaseConnection();

process.on('SIGINT', () => {
  databaseConnection.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
