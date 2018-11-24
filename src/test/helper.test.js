const emojiReplacer = require('../helper/emojiReplacer');

test('replaces HTML with Discord emojis', () => {
  expect(emojiReplacer('[range]')).toBe(':swdrange:');
});
