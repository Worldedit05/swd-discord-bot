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
    url: 'https://www.fantasyflightgames.com/en/rss/',
    refresh: 300
  });

  feeder.on('new-item', async function(item) {
    const articleDescription = item.description;
    let starWarsArticleLink = '';
    let isSavedArticle = false;

    if (articleDescription.includes('Star Wars') && articleDescription.includes('Destiny') || articleDescription.includes('Star Wars: Destiny')) {
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
