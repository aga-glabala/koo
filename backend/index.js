"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongo = require('mongodb');

var db

app.use(bodyParser.json())

// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
mongo.MongoClient.connect(
  'mongodb://mo1062_koo_dev:TOfcOP4etQiEnYWO3myX@mongo10.mydevil.net:27017/mo1062_koo_dev', 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  (err, database) => {
  if (err) return console.log(err)
  db = database.db('mo1062_koo_dev')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

// ACTIONS

app.get('/actions', (req, res) => {
  db.collection('actions').find().toArray((err, result) => {
    if (err) return console.log(err)
    result.forEach(convertActionFromBson);
    res.send(result)
  })
})

app.get('/actions/:id', (req, res) => {
  db.collection('actions').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    console.log('find one');
    if (err) return console.log(err)
    if (!result) {
      res.sendStatus(404);
      return;
    }
    convertActionFromBson(result);
    res.send(result)
  })
})

app.post('/actions', (req, res) => {
  const data = req.body;
  convertActionToBson(data);
  db.collection('actions').insertOne(data, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database ');
    res.redirect('/actions/'+result.insertedId);
  })
})

app.put('/actions/:id', (req, res) => {
  const data = req.body;
  convertActionToBson(data);
  db.collection('actions')
  .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, {
    $set: data
  }, {
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    const data = req.body;
    convertActionFromBson(data);
    res.send(data)
  })
})

app.delete('/actions/:id', (req, res) => {
  db.collection('actions').findOneAndDelete({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})

function convertActionFromBson(action) {
  action.id = action._id;
  delete action._id;
}

function convertActionToBson(action) {
  if (action.id) {
    action._id = new mongo.ObjectID(action.id);
    delete action.id;
  }
}

// ORDERS

app.get('/actions/:actionId/orders', (req, res) => {
  db.collection('orders').find({ actionId: req.params.actionId }).toArray((err, result) => {
    if (err) return console.log(err)
    result.forEach(convertOrderFromBson);
    res.send(result)
  })
})

app.get('/orders/:id', (req, res) => {
  db.collection('orders').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    console.log('find one');
    if (err) return console.log(err)
    if (!result) {
      res.sendStatus(404);
      return;
    }
    convertOrderFromBson(result);
    res.send(result)
  })
})

app.get('/actions/:actionId/myorders', (req, res) => {
  db.collection('orders').findOne({ actionId: req.params.actionId, ownerId: req.query.forUser }, (err, result) => {
    console.log('find one');
    if (err) return console.log(err)
    if (!result) {
      res.sendStatus(404);
      return;
    }
    convertOrderFromBson(result);
    console.log(result);
    res.send(result)
  })
})

app.post('/orders', (req, res) => {
  const data = req.body;
  convertOrderToBson(data);
  db.collection('orders').insertOne(data, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database ');
    res.redirect('/orders/'+result.insertedId);
  })
})

app.put('/orders/:id', (req, res) => {
  const data = req.body;
  convertOrderToBson(data);
  db.collection('orders')
  .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, {
    $set: data
  }, {
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/orders/:id', (req, res) => {
  db.collection('orders').findOneAndDelete({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})

function convertOrderFromBson(action) {
  action.id = action._id;
  delete action._id;
}

function convertOrderToBson(action) {
  if (action.id) {
    action._id = new mongo.ObjectID(action.id);
    delete action.id;
  }
}