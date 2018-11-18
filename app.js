const axios = require('axios');
const path = require('path');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();
const { CommandoClient } = require('discord.js-commando');
const firebase = require("./src/dbRepository/connection");
const databaseConnection = require('./src/database');
const { Article } = require('./src/database/model');
const logger = require('pino')({ prettyPrint: {colorize: true}});

const config = process.env.PRODUCTION ? null : require("./config.json");
const botId = process.env.BOT_ID || config.bot_id;
const ownerId = process.env.OWNER_ID || config.owner_id;
const channel_id = process.env.CHANNEL_ID || config.channel_id;

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

client.on("ready", () => {
  logger.info("Bot is now online. I am ready!");
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

const token = process.env.BOT_TOKEN || config.token;

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

  if (articleDescription.includes('Star Wars: Destiny')){
    starWarsArticleLink = item.link;

    try {
      const results = await read({guid: `${item.guid}`});
      isSavedArticle = results.length > 0;
    } catch(err) {
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

function read (query){
  return new Promise(resolve => {
    Article.find(query, (err, docs) => {
      if (err) {
        reject(err);
      }

      resolve(docs);
    });
  })

}
