const mongoose = require('mongoose');
const articleSchema = require('../schema/articleSchema');

module.exports = mongoose.model('Article', articleSchema);
