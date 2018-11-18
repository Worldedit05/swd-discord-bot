const databaseConnection = require('./src/database');

const articleWatch = require('./src/activites/articleWatch');

// Get Discord client
require('./src/client');

databaseConnection();

//Start extra workers6
articleWatch();
