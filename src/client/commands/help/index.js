const common = require('../../../common/common.data.json');
const helpMessage = `
!get

  Returns card(s) that match the exact name or title provided. A set flag to narrow the results.

  Example:
    !get Luke Skywalker --set=wotf

  Notes:
    valid set flags -> ${common.released_sets.join(' | ').toLowerCase()}
`;

const helpCommand = (message) => {
  message.channel.send(helpMessage);
};

module.exports = helpCommand;
