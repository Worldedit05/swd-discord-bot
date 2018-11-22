const databaseConnection = require('./src/database');

// Get Discord client
require('./src/client');

databaseConnection();
