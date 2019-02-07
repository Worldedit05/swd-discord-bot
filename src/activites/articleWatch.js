const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();

const { Article } = require('../database/model');
const { read } = require('../database/action');

if (process.env.PRODUCTION !== 'production') {
  require('dotenv').load();
}

const logger = require('pino')({
  prettyPrint: {
    colorize: true
  }
});

module.exports = (channel) => {
  feeder.add({
    url: 'https://www.fantasyflightgames.com/en/rss/?',
    refresh: 300
  });

  feeder.on('new-item', async function(item) {
    const articleDescription = item.description;
    let starWarsArticleLink = '';
    let isSavedArticle = false;

    logger.info(`Item in the RSS feed. Checking article: ${item.link}`);

    if (articleDescription.includes('Star Wars') && articleDescription.includes('Destiny')) {
      starWarsArticleLink = item.link;
      logger.info(`New Star Wars article found: ${item.link}`);
      try {
        const results = await read({
          guid: `${item.guid}`
        });

        isSavedArticle = results.length > 0;
        logger.info(`Article ${item.title} ${isSavedArticle ? 'was' : 'was not'} saved in the database`);
      } catch (err) {
        logger.info(err);
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
          logger.error(err);
        }
      });
    }
  });
};
