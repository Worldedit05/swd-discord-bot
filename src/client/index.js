const Discord = require('discord.js');
const axios = require('axios');
const articleWatch = require('../activites/articleWatch');
const { getCard, getSimpleCardEmbed } = require('../helper');

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

  if (command !== 'get') {
    return message.channel.send(`Unknown command: ${command}`);
  }

  var cardQuery = {
    'card_name': args.join(' '),
    'set_name_code': null
  };

  const cards = getCard(cardQuery);

  if (cards.length === 0) {
    logger.info(`No card found for ${JSON.stringify(args)}`);
    return message.author.send('Sorry could not find a card with that name. :cry: Please check the spelling and try again!');
  }
  // TODO
  // if (cards.length > 1) {
  //   return message.channel.send('Multiple cards found');
  // }

  for (let i = 0; i < cards.length; i++) {
    var completeCardObject = await axios.get(`https://swdestinydb.com/api/public/card/${cards[i].code}`);
    const embed = getSimpleCardEmbed(completeCardObject.data);
    message.channel.send(embed);
  }
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
