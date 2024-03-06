
const admin = require("firebase-admin");
const constant = require("./constant");

admin.initializeApp({
  credential: admin.credential.cert(constant.key),
});

const db = admin.firestore();

module.exports = db;
