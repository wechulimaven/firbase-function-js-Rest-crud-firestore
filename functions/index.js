const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));

app.get('/', async (req,res)=>{
const snapshot = await admin.firestore().collection('users').get();

let users = [];snapshot.forEach(doc=>{
    let id = doc.id;
    let data = doc.data();

    users.push({id, ...data});
});

res.status(200).send(JSON.stringify(users));
    
});

app.post('/', async (req, res) => {
    const user = req.body;
    await admin.firestore().collection('users').add(user);
    res.status(201).send(user);
    // response.send("user");
  });

app.get("/:id", async(req,res)=>{
const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();
const userId = snapshot.id;
const userData = snapshot.data();

res.status(200).send(JSON.stringify({id: userId, ...userData}));



});

app.put("/:id", async (req, res)=>{

const body = req.body;
await admin.firestore().collection('users').doc(req.params.id).update({body});
const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();
const data = snapshot.data();
res.status(200).send(JSON.stringify({...data}));



});
app.delete("/:id", async (req, res)=>{

const body = req.body;
await admin.firestore().collection('users').doc(req.params.id).delete();

res.status(200).send({"status":true,"message":"User deleted successfully"});



});

exports.user = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
