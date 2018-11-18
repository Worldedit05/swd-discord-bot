const { Article } = require('../model');

module.exports = function read(query) {
  return new Promise((resolve, reject) => {
    Article.find(query, (err, docs) => {
      if (err) {
        reject(err);
      }

      resolve(docs);
    });
  });
};
