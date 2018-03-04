const Discord = require('discord.js');
const client = new Discord.Client();

function getSimpleCardEmbed(card) {
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
        color = 'GREY'
  }

  var embed = new Discord.RichEmbed()
    .setTitle(`${card.label}`)
    .setImage(`${card.imagesrc}`)
    .setURL(card.url)
    .setColor(color)
  return embed;
}

module.exports = getSimpleCardEmbed;
