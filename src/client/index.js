const Discord = require('discord.js');
const articleWatch = require('../activites/articleWatch');
const helpCommand = require('./commands/help');
const getCardCommand = require('./commands/card/get');
const getInfoCommand = require('./commands/info');
const getHealthCheckCommand = require('./commands/health');

const ownerId = process.env.OWNER_ID;
const channel_id = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKEN;
const commandPrefix = '!';

const { logger } = require('../helper/logger');

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
  case 'help':
    helpCommand(message);
    break;
  case 'info':
    getInfoCommand(message);
    break;
  case 'get':
    getCardCommand(message, args);
    break;
  case 'health':
    getHealthCheckCommand(message);
    break;
  default:
    return message.channel.send(`I am sorry ${message.author}. I am afraid I can't do that. https://media.giphy.com/media/CdY6WueirK8Te/giphy.gif`);
  }
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
