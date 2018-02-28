const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = function getCardEmbed(card) {
  var embed = new Discord.RichEmbed()
    .setImage("http://i.imgur.com/yVpymuV.png");

  return embed;
}
