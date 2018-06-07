const { Command } = require('discord.js-commando');
const npmRun = require('npm-run');

module.exports = class UpdateDbCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'update-db',
      group: 'admin',
      memberName: 'update-db',
      description:'Updates the json data on the server',
    });
  }

  hasPermission(message) {
    if (!this.client.isOwner(message.author)) {
      return 'Only the bot owner may use this command.';
    }

    return true;
  }

  async run(message, { }) {
    const messageContent = message.content.toLowerCase();

    if (message.author.bot) {
      return;
    }
    console.log(`User '${message.author.username} ${message.author.id}' sent command '${message.content}'`);

    npmRun.exec('yarn upgrade swdestinydb-json-data', {}, (err, stdout, stderr) => {
      if (err) {
        message.author.send('Error occurred. Please check logs');
      }

      message.author.send(stdout);
      message.author.send(stderr);
    })
  }
}
