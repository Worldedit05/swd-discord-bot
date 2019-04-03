const Discord = require('discord.js');
const cardContants = require('../../../../helper/constants/cards');
const formats = require('../../../../../node_modules/swdestinydb-json-data/formats.json');

const addBalanceInfo = (card, embed) => {

  if(card.points){
    embed.setDescription('Balance of the Force', 'info');
    formats.forEach((format) => {
      const isCardInFormat = format.data.sets.includes(card.set_code);
      embed.addField(format.name, isCardInFormat ? format.data.balance[card.code] || card.points : 'N/A', true);
    });
  }
};

const isBalanced = (code) => {
  for (var i = 0; i < formats.length; i++) {
    var format = formats[i];
    var balance = format.data.balance;

    if (balance[code]) {
      return true;
    }
  }

  return false;
};

const addSubTypeInfo = (card, embed) => {
  if (card.subtypes) {
    const listOfSubtypes = [];
    card.subtypes.forEach(type => listOfSubtypes.push(type.name));
    embed.addField('Subtypes', listOfSubtypes.join(' - '));
  }
};

function getSimpleCardEmbed(card) {
  let color;
  switch(card.faction_code) {
  case 'red':
    color = 'RED';
    break;
  case 'yellow':
    color = 'GOLD';
    break;
  case 'blue':
    color = 'BLUE';
    break;
  default:
    color = 'GREY';
  }

  var imageUrl = card.imagesrc || cardContants.cardPlaceholderUrl;

  var embed = new Discord.RichEmbed()
    .setTitle(`${card.label}`)
    .setImage(imageUrl)
    .setURL(card.url)
    .setColor(color);

  if(isBalanced(card.code)) {
    addBalanceInfo(card, embed);
  }

  if(card.has_errata) {
    addSubTypeInfo(card, embed);
  }

  return embed;
}

module.exports = getSimpleCardEmbed;
