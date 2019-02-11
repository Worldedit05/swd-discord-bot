const common = require('../../../common/common.data.json');
const helpMessage = `\`\`\`yaml
-!help

    Info: The help command.

-!get

    Info: Returns card(s) that match the exact name or title provided. A set flag to narrow the results.

    Example:
      !get Luke Skywalker --set=wotf

    Notes:
      valid flags - ${common.released_sets.join(' | ').toLowerCase()}
\`\`\``;

const helpCommand = (message) => {
  message.channel.send(helpMessage);
};

module.exports = helpCommand;
