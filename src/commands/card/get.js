const axios = require('axios');
const { Command } = require('discord.js-commando');
const { getCard, getSimpleCardEmbed } = require('../../helper');
const cardSets = require('../../helper/common.data.json');
const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

module.exports = class GetCardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'get',
      group: 'card',
      memberName: 'get',
      description:'Display the card image for a single Star Wars Destiny card. Note: name should be surrounded in quotes.',
      examples: ['get "Rey" AW'],
      args: [
        {
          key: 'cardName',
          prompt: 'What is the card name?',
          type: 'string'
        },
        {
          key: 'setName',
          prompt: `What set does the card belong to? Available options: ${cardSets.released_sets.toString().replace(/,/g, ', ')}`,
          type: 'string'
        }
      ]
    });
  }

  async run(message, { cardName, setName }) {
    if (message.author.bot) {
      return;
    }
    logger.info(`User '${message.author.username} ${message.author.id}' sent command '${message.content}'`);

    var args = {
      'card_name': cardName,
      'set_name_code': setName
    };

    var foundCardsArray = getCard(args);

    if (foundCardsArray.length === 0) {
      logger.info(`No card found for ${JSON.stringify(args)}`);
      return message.author.send('Sorry could not find a card with that name. :cry: Please check the spelling and try again!');
    }
    for (var i = 0; i < foundCardsArray.length; i++) {
      var cardCode = foundCardsArray[i].code;
      var completeCardObject = await axios.get(`https://swdestinydb.com/api/public/card/${cardCode}`);
      logger.info(`SWDestinydb returned ${JSON.stringify(completeCardObject.data)}`);
      var embed = getSimpleCardEmbed(completeCardObject.data);

      message.channel.send({ embed });
    }
  }
};
