const Discord = require('discord.js');
const client = new Discord.Client();

function getDetailedCardEmbed(card) {
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

  var imageUrl = `${card.imagesrc}` || 'http://via.placeholder.com/298x418?text=No+Card+Image';

  var embed = new Discord.RichEmbed()
    .setTitle(`${card.label}`)
    .setImage(imageUrl)
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

module.exports = getDetailedCardEmbed;
