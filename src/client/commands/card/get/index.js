const axios = require('axios');
const getCard = require('./getCard');
const getSimpleCardEmbed = require('./getSimpleCardEmbed');
const getSetName = require('./getSetName');
const removeSetNameFromArgs = require('./removeSetNameFromArgs');

const cardContants = require('../../../../helper/constants/cards');
const { logger } = require('../../../../helper/logger');

const getCardCommand = async (message, args) => {
  const setName = getSetName(args);
  removeSetNameFromArgs(args, setName);

  var cardQuery = {
    'card_name': args.join(' '),
    'set_name_code': setName
  };
  logger.debug(cardQuery);
  const cards = getCard(cardQuery);
  logger.debug(cards);
  if (cards.length === 0) {
    logger.info(`No card found for ${JSON.stringify(args)}`);
    return message.author.send(cardContants.noCardFoundMessage);
  }

  for (let i = 0; i < cards.length; i++) {
    var completeCardObject = await axios.get(cardContants.swdestinyDbBaseUrl + cards[i].code);
    const embed = getSimpleCardEmbed(completeCardObject.data);
    message.channel.send(embed);
  }
};

module.exports = getCardCommand;
