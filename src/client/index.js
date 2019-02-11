const Discord = require('discord.js');
const articleWatch = require('../activites/articleWatch');
const getCardCommand = require('./commands/card/get');

const ownerId = process.env.OWNER_ID;
const channel_id = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKEN;
const commandPrefix = '!';

const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

const client = new Discord.Client({
  owner: ownerId,
  disableEveryone: true
});

client.on('ready', () => {
  logger.info('Bot is now online. I am ready!');
  const channel = client.channels.get(channel_id);

  articleWatch(channel);
});

client.on('error', (error) => {
  logger.error(error);
  process.exit(1);
});

client.on('message', async message => {
  if (!message.content.startsWith(commandPrefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(commandPrefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
  case 'get':
    getCardCommand(message, args);
    break;
  default:
    return message.channel.send(`Unknown command: ${command}`);
  }
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
