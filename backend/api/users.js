const mongo = require('mongodb');

const converters = require('./../converters');

module.exports = function (app, dbGetter, guard) {
  app.get('/users', (req, res) => {
    dbGetter().collection('users').find({ accepted: req.query.accepted === 'true' }).toArray((err, result) => {
      if (err) return console.log(err)
      result.forEach(converters.userFromBson);
      res.send(result)
    })
  });

  app.get('/users/:id', (req, res) => {
    dbGetter().collection('users').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
      if (err) return console.log(err)
      if (!result) {
        res.sendStatus(404);
        return;
      }
      converters.userFromBson(result);
      res.send(result)
    })
  });

  app.post('/users/:id/accept', guard.check('admin'), (req, res) => {
    dbGetter().collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, { $set: { accepted: true } }, {}, (err, result) => {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      }
      res.send(result);
    });
  });

  app.post('/users/:id/makeAdmin', guard.check('admin'), (req, res) => {
    dbGetter().collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, { $set: { admin: true } }, {}, (err, result) => {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      }
      res.send(result);
    });
  });
}  