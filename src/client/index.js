const Discord = require('discord.js');
const articleWatch = require('../activites/articleWatch');

const ownerId = process.env.OWNER_ID;
const channel_id = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKEN;

const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

const client = new Discord.Client({
  commandPrefix: '!',
  owner: ownerId,
  disableEveryone: true
});

// client.registry
//   .registerDefaultTypes()
//   .registerGroups([
//     ['card', 'Commands to bring up Star Wars Destiny cards']
//   ])
//   .registerDefaultGroups()
//   .registerDefaultCommands()
//   .registerCommandsIn(path.join(__dirname, '../commands'));

client.on('ready', () => {
  logger.info('Bot is now online. I am ready!');
  const channel = client.channels.get(channel_id);

  articleWatch(channel);
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
