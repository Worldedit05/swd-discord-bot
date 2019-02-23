const infoMessage = 'cardbot is built using a NodeJS Discord framework. https://discord.js.org/#/';

const infoCommand = (message) => {
  message.channel.send(infoMessage);
};

module.exports = infoCommand;
