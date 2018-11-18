const path = require('path');
const { CommandoClient } = require('discord.js-commando');

const ownerId = process.env.OWNER_ID;
const token = process.env.BOT_TOKEN;

const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

const client = new CommandoClient({
  commandPrefix: '!',
  owner: ownerId,
  disableEveryone: true
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['card', 'Commands to bring up Star Wars Destiny cards']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, '../commands'));

client.on('ready', () => {
  logger.info('Bot is now online. I am ready!');
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
