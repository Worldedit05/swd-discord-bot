if (process.env.PRODUCTION !== 'production') {
  require('dotenv').config();
}

const databaseConnection = require('./src/database');
// Get Discord client
require('./src/client');

databaseConnection();
