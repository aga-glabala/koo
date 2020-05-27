const mongo = require('mongodb');

const converters = require('./../converters');

module.exports = function (app, dbGetter) {
  app.get('/dashboard', (req, res) => {
    const userId = req.user.id;

    Promise.all([
      getEndingSoonActions(),
      getUserOrders(userId),
      getActionsHelpingIn(userId)
    ]).then((data) => {
      const dashboard = {
        actions: data[0],
        userOrders: data[1],
        helperActions: data[2],
      };
      res.send(dashboard);
    }).catch(error => res.status(500).send(error));
  });

  function getEndingSoonActions() {
    return dbGetter()
      .collection('actions')
      .find({ orderDate: { '$gte': new Date().getTime() } })
      .sort({ orderDate: 1 })
      .limit(6)
      .toArray()
      .then(actions => actions.map(converters.actionFromBson));
  }

  function getUserOrders(userId) {
    return dbGetter()
      .collection('orders')
      .find({ ownerId: userId })
      .toArray()
      .then(orders => orders.map(converters.orderFromBson))
      .then(orders => {
        let actionIds = orders.map((order) => new mongo.ObjectID(order.actionId));
        return dbGetter()
          .collection('actions')
          .find({ _id: { $in: actionIds } })
          .toArray()
          .then(actions => actions.map(converters.actionFromBson))
          .then(actions => actions.map((action) => {
              const order = orders.find((order) => action.id == order.actionId);
              return { action, order };
            })
          );
      });
  }

  function getActionsHelpingIn(userId) {
    return dbGetter()
    .collection('actions')
    .find({ collectionDate: { '$gte': new Date().getTime() }, helpers: { $elemMatch: { helperId: userId } } })
    .sort({ createdOn: 1 })
    .toArray()
    .then(actions => actions.map(converters.actionFromBson))
    .then(actions => actions.map(action => {
      return { action: action, helpers: action.helpers.filter(h => h.helperId == userId) };
    }));
  }
};