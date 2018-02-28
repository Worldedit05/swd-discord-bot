const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = function getCardEmbed(card) {
  let color;
  switch(card.faction_code) {
    case 'red':
        color = 'RED'
        break;
    case 'yellow':
        color = 'GOLD'
        break;
    case 'blue':
        color = 'BLUE'
        break;
    default:
        color = 'DEFAULT'
  }

  var embed = new Discord.RichEmbed()
    .setTitle(`${card.name} ${card.subtitle}`)
    .setImage(`${card.imagesrc}`)
    .setColor(color);
  return embed;
}
