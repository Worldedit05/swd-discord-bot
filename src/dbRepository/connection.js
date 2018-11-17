const firebaseAdmin = require('firebase-admin');
const config = process.env.PRODUCTION ? null : require("../../config.json");

module.exports = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID || config.firebase.project_id,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || config.firebase.client_email,
    privateKey: process.env.PRODUCTION ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : config.firebase.private_key
  }),
  databaseURL: process.env.FIREBASE_DB_URL || config.firebase.database_url,
});
