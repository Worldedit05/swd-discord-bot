module.exports = {
  logger: require('pino')({
    prettyPrint: {
      colorize: true
    },
    level: process.env.LOG_LEVEL,
  })
};
