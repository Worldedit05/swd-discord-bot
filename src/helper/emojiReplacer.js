const emojiReplacer = (string) => {
  let newString = string.replace(/\[/g, ':swd');
  newString = newString.replace(/\]/g, ':');
  return newString;
};

module.exports = emojiReplacer;
