const Discord = require('discord.js');
const axios = require('axios');
const articleWatch = require('../activites/articleWatch');
const { getCard, getSimpleCardEmbed, getDetailedCardEmbed } = require('../helper');

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

client.on('message', async message => {
  if (!message.content.startsWith(commandPrefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(commandPrefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  var cardQuery = {
    'card_name': args.join(' '),
    'set_name_code': null
  };

  const cards = getCard(cardQuery);
  for (let i = 0; i < cards.length; i++) {
    var completeCardObject = await axios.get(`https://swdestinydb.com/api/public/card/${cards[i].code}`);
    const embed = getDetailedCardEmbed(completeCardObject.data);
    message.channel.send(embed);
  }
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

client.login(token);

module.exports = client;
