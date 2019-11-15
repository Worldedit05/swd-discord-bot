const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();

const { Article } = require('../database/model');
const { readArticles } = require('../database/action');
const { logger } = require('../helper/logger');

const searchTerms = ['star wars: destiny', 'star wars destiny'];

const isRelevantArticle = (description) => {
  const lowerCaseDescription = description.toLowerCase();

  for(let i = 0; i < searchTerms.length; i++) {
    if(lowerCaseDescription.includes(searchTerms[i])) {
      return true;
    }
  }

  return false;
};

module.exports = (channel) => {
  feeder.add({
    url: 'https://www.fantasyflightgames.com/en/rss/',
    refresh: 180
  });

  feeder.on('new-item', async function(item) {
    logger.info(`Incoming item in RSS feed: ${item.title}`);
    const articleDescription = item.description;
    let articleLink = '';
    let isSavedArticle = false;

    if (isRelevantArticle(articleDescription)) {
      articleLink = item.link;
      logger.info(`New article found in RSS feed: ${item.title} - ${item.link}`);
      try {
        const results = await readArticles({
          guid: `${item.guid}`
        });

        isSavedArticle = results.length > 0;
        logger.info(`Article "${item.title}" ${isSavedArticle ? 'was' : 'was not'} found in the database`);
      } catch (err) {
        logger.error(`Error when reading the database: ${err}`);
      }
    }

    if (!isSavedArticle && articleLink) {
      const currentTime = new Date().toISOString();

      channel.send(`${articleLink}`);

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
