const axios = require('axios');
const { Command } = require('discord.js-commando');
const { getCard, getSimpleCardEmbed } = require('../../helper');
const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

module.exports = class ListCardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list',
      group: 'card',
      memberName: 'list',
      description:'Lists card images of all cards for the same character. Note: name should be surrounded in quotes.',
      examples: ['list "Rey"'],
      args: [
        {
          key: 'cardName',
          prompt: 'What is the card name?',
          type: 'string'
        }
      ]
    });
  }

  async run(message, { cardName }) {
    if (message.author.bot) {
      return;
    }
    logger.info(`User '${message.author.username} ${message.author.id}' sent command '${message.content}'`);

    var args = {
      'card_name': cardName,
      'set_name_code': null
    };
    logger.info(args);
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
