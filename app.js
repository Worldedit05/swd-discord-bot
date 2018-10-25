const axios = require('axios');
const path = require('path');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();
var firebaseAdmin = require('firebase-admin');

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
        ['card', 'Commands to bring up Star Wars Destiny cards']
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

var firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID || config.firebase.project_id,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || config.firebase.client_email,
    privateKey: process.env.PRODUCTION ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : config.firebase.private_key
  }),
  databaseURL: process.env.FIREBASE_DB_URL || config.firebase.database_url,
});

feeder.add({
  url: 'https://www.fantasyflightgames.com/en/rss/',
  refresh: 300
});

feeder.on('new-item', async function(item) {
  const ref = firebase.database().ref('/articles');
  let articleDescription = item.description;
  let starWarsArticleLink = '';
  let isSavedArticle = false;
  let guid = Buffer.from(item.guid).toString('base64');

  if (articleDescription.includes('Star Wars: Destiny')){
    starWarsArticleLink = item.link;
    await ref.once("value", function(snapshot) {
      if (snapshot.val() && snapshot.val()[guid]) {
        console.log(`Article "${item.link}" exists in db`);
        isSavedArticle = true;
      }
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
