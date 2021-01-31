const mongo = require('mongodb');

const converters = require('./../converters');

const STATS_DATE_OFFSET = 3 * 30 * 24 * 3600 * 1000; // 3 months

module.exports = function (app, dbGetter, guard) {
  app.get('/users', (req, res) => {
    dbGetter()
      .collection('users')
      .find({ accepted: req.query.accepted === 'true' })
      .toArray()
      .then(users => {
        const userIds = users.map(user => user._id.toHexString());
        return getOrganizedCount(userIds)
          .then(organizedCounts => {
            return getHelpedCount(userIds)
              .then(helpedCounts => {
                return users.map(u => {
                  const organizedCount = organizedCounts.find(c => c._id == u._id);
                  const helpedCount = helpedCounts.find(c => c._id == u._id);
                  u.organizedActionsCount = organizedCount ? organizedCount.count : undefined
                  u.helpedCount = helpedCount ? helpedCount.count : undefined
                  return u;
                });
              });
          });
      })
      .then(result => {
        result.forEach(converters.userFromBson);
        res.send(result);
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get('/users/:id', (req, res) => {
    dbGetter()
      .collection('users')
      .findOne({ _id: new mongo.ObjectID(req.params.id) })
      .then(result => {
        if (!result) {
          res.sendStatus(404);
          return;
        }
        const userIds = [result._id.toHexString()];
        getOrganizedCount(userIds)
          .then(organizedCounts => {
            return getHelpedCount(userIds)
              .then(helpedCounts => {
                const organizedCount = organizedCounts.find(c => c._id == result._id);
                const helpedCount = helpedCounts.find(c => c._id == result._id);
                result.organizedActionsCount = organizedCount ? organizedCount.count : undefined
                result.helpedCount = helpedCount ? helpedCount.count : undefined
                converters.userFromBson(result);
                res.send(result)
              });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
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

  app.post('/users/:id/removeAdmin', guard.check('admin'), (req, res) => {
    dbGetter().collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, { $set: { admin: false } }, {}, (err, result) => {
      if (err) {
        res.sendStatus(500);
       return console.log(err);
      }
      res.send(result);
    });
  });

  app.delete('/users/:id', guard.check('admin'), (req, res) => {
    dbGetter().collection('users').deleteOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      }
      res.sendStatus(204);
    });
  });
  
  function getHelpedCount(userIds) {
    const notOlderThan = new Date().getTime() - STATS_DATE_OFFSET;
    return dbGetter().collection('actions').aggregate([
      { $match: { 'helpers.helperId': { $in: userIds }, createdOn: { $gt: notOlderThan } } },
      { $unwind: '$helpers' },
      { $group: { _id: "$helpers.helperId", actionIds: { $addToSet: "$_id" } } },
      { $unwind: '$actionIds' },
      { $group: { _id: "$_id", count: { $sum: 1 } } }
    ]).toArray();
  }

  function getOrganizedCount(userIds) {
    const notOlderThan = new Date().getTime() - STATS_DATE_OFFSET;
    return dbGetter().collection('actions').aggregate([
      { $match: { 'createdBy.id': { $in: userIds.map((uid) => { new mongo.ObjectID(uid) }) }, 'createdOn': { $gt: notOlderThan } } },
      { $group: { _id: "$createdBy.id", count: { $sum: 1 } } }
    ]).toArray();
  }
}