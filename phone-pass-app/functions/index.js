// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers
const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");

// The Firebase Admin SDK to access Firestore
const admin = require("firebase-admin");
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();


const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: true }));

app.get ("/", (req, res) => {
  return res.status(200).send("Hi there what is up");
});

exports.app = functions.https.onRequest(app);

