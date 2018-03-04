const axios = require('axios');

const { Command } = require('discord.js-commando');
const { getCard, getSimpleCardEmbed } = require('../../helper');

const cardSets = require('../../helper/common.data.json');

module.exports = class ListCardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list',
      group: 'card',
      memberName: 'list',
      description:'Lists card images of all cards for the same character',
      examples: ['list Rey'],
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
    const messageContent = message.content.toLowerCase();

    if (message.author.bot) {
      return;
    }
    console.log(`User '${message.author.username}' sent command '${message.content}'`);

    var args = {
      "card_name": cardName,
      "set_name_code": null
    };
    console.log(args);
    var foundCardsArray = getCard(args);

    if (foundCardsArray.length === 0) {
      console.log(`No card found for ${JSON.stringify(args)}`);
      return message.author.send("Sorry could not find a card with that name. :cry: Please check the spelling and try again!")
    }
    for (var i = 0; i < foundCardsArray.length; i++) {
      var cardCode = foundCardsArray[i].code;
      var completeCardObject = await axios.get(`https://swdestinydb.com/api/public/card/${cardCode}`);
      console.log(`SWDestinydb returned ${JSON.stringify(completeCardObject.data)}`);
      var embed = getSimpleCardEmbed(completeCardObject.data);

      message.channel.send({embed});
    }
  }
}
