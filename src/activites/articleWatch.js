const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();

const { Article } = require('../database/model');
const { readArticles } = require('../database/action');
const { logger } = require('../helper/logger');

module.exports = (channel) => {
  feeder.add({
    url: 'https://www.fantasyflightgames.com/en/rss/',
    refresh: 300
  });

  feeder.on('new-item', async function(item) {
    const articleDescription = item.description;
    let starWarsArticleLink = '';
    let isSavedArticle = false;

    if (articleDescription.includes('Star Wars') && articleDescription.includes('Destiny')) {
      starWarsArticleLink = item.link;
      logger.info(`New Star Wars article found in RSS feed: ${item.link}`);
      try {
        const results = await readArticles({
          guid: `${item.guid}`
        });

        isSavedArticle = results.length > 0;
        logger.info(`Article ${item.title} ${isSavedArticle ? 'was' : 'was not'} found in the database`);
      } catch (err) {
        logger.error(`Error when reading the database: ${err}`);
      }
    }

    if (!isSavedArticle && starWarsArticleLink) {
      const currentTime = new Date().toISOString();

      channel.send(`${starWarsArticleLink}`);

      const article = new Article({
        title: item.title,
        link: item.link,
        guid: item.guid,
        createDate: currentTime,
        modifyDate: currentTime
      });
      article.save((err) => {
        if (err) {
          logger.error(`Error occurred when saving to the database: ${err}`);
        }
      });
    }
  });
};
