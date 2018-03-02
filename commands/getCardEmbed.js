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
        color = 'GREY'
  }

  var embed = new Discord.RichEmbed()
    .setTitle(`${card.label}`)
    .setImage(`${card.imagesrc}`)
    .setURL(card.url)
    .setColor(color)
    .setDescription(card.text)
    .addField('Character Points', card.points === null ? 'N/A' : card.points, true)
    .addField('Cost', card.cost === null ? 'N/A' : card.cost, true)
    .addField('Affiliation', card.affiliation_name, true)
    .addField('Set', card.set_name, true)
    .addField('Rarity', card.rarity_name, true)
    .addField('Errata\'d', card.has_errata, true)
    .setFooter(card.flavor === null ? '' : card.flavor);
  return embed;
}
