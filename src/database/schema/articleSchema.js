const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  title: String,
  link: String,
  guid: String,
  createDate: Date,
  modifyDate: Date
});
