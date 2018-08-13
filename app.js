const axios = require('axios');
const path = require('path');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();
const firebase = require('firebase/app');
require('firebase/database');

const { CommandoClient } = require('discord.js-commando');

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
        ['card', 'Commands to bring up Star Wars Destiny cards'],
        ['admin', 'Admin commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on("ready", () => {
  console.log("I am ready!");
});

//TODO:
// - DRY up some of the card commands
// - Make a "good bot" reply and counter
// - Card count stats

const token = process.env.BOT_TOKEN || config.token;

client.login(token);

var firebaseApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY || config.firebase_api_key,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || config.firebase_auth_domain,
    databaseURL: process.env.FIREBASE_DB_URL || config.firebase_db_url,
    projectId: process.env.FIREBASE_PRODJECT_ID || config.firebase_prodject_id,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || config.firebase_storage_bucket,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || config.firebase_messaging_sender_id
  });

feeder.add({
  url: 'https://www.fantasyflightgames.com/en/rss/',
  refresh: 300
});

feeder.on('new-item', function(item) {
  const ref = firebase.database().ref('/articles');
  let articleDescription = item.description;
  let starWarsArticleLink = '';
  let isSavedArticle = false;
  let guid = Buffer.from(item.guid).toString('base64');

  if (articleDescription.includes('Star Wars: Destiny')){
    starWarsArticleLink = item.link;

    ref.orderByChild("id").equalTo(guid).on("child_added", function(snapshot) {
      console.log(snapshot.val());
      isSavedArticle = true;
    });
  }

  if (!isSavedArticle && starWarsArticleLink) {
    let currentTime = new Date().toISOString();
    client.channels.get(channel_id).send(`${starWarsArticleLink}`);

    firebase.database().ref(`/articles/${guid}`).set({
      title: `${item.title}`,
      link: `${item.link}`,
      createDate: `${currentTime}`,
      updateDate: `${currentTime}`
    });
  }
})
