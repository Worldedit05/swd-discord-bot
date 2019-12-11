const sets = require('swdestinydb-json-data/sets');

const helpMessage = `\`\`\`yaml
-!help

    Info: The help command.

-!info

    Info: Returns development info about cardbot.

-!get

    Info: Returns card(s) that match the exact name or title provided. A set flag will narrow the results.

    Example:
      !get Luke Skywalker --set=wotf

    Notes:
      valid flags - ${sets.map((set => set.code.toLowerCase())).join(' | ')}

${sets.map(set => `\t\t\t${set.code.toLowerCase()} = ${set.name}\n`).join('')}
\`\`\``;

const helpCommand = (message) => {
  message.channel.send(helpMessage);
};

module.exports = helpCommand;
