const path = require('path');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();
const databaseConnection = require('./src/database');

const { CommandoClient } = require('discord.js-commando');
const { Article } = require('./src/database/model');
const { read } = require('./src/database/action');

const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

if (process.env.PRODUCTION !== 'production') {
  require('dotenv').load();
}

const ownerId = process.env.OWNER_ID;
const channel_id = process.env.CHANNEL_ID;

const client = new CommandoClient({
  commandPrefix: '!',
  owner: ownerId,
  disableEveryone: true
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['card', 'Commands to bring up Star Wars Destiny cards']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'src/commands'));

client.on('ready', () => {
  logger.info('Bot is now online. I am ready!');
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

const token = process.env.BOT_TOKEN;

client.login(token);

feeder.add({
  url: 'https://www.fantasyflightgames.com/en/rss/',
  refresh: 300
});

databaseConnection();

feeder.on('new-item', async function(item) {
  let articleDescription = item.description;
  let starWarsArticleLink = '';
  let isSavedArticle = false;

  if (articleDescription.includes('Star Wars: Destiny')) {
    starWarsArticleLink = item.link;

    try {
      const results = await read({
        guid: `${item.guid}`
      });
      isSavedArticle = results.length > 0;
    } catch (err) {
      logger.info(err);
    }
  }

  if (!isSavedArticle && starWarsArticleLink) {
    let currentTime = new Date().toISOString();
    client.channels.get(channel_id).send(`${starWarsArticleLink}`);

    const article = new Article({
      title: item.title,
      link: item.link,
      guid: item.guid,
      createDate: currentTime,
      modifyDate: currentTime
    });
    article.save((err) => {
      if (err) {
        logger.error(err);
      }
    });
  }
});
