const mongoose = require('mongoose');
const { logger } = require('../helper/logger');

const connection = () => {
  mongoose.connect(process.env.MONGO_DB_URL, { poolSize: 3, useNewUrlParser: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    logger.error(err);
  });

  db.on('open', () => {
    logger.info('Database connection successful');
  });

  db.on('close', () => {
    logger.info('Database connection closed successfully');
  });

  return db;
};

module.exports = connection;
