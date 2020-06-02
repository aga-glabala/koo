const mongo = require('mongodb');

const converters = require('./../converters');

module.exports = function (app, dbGetter) {
  app.get('/actions/:actionId/orders', (req, res) => {
    dbGetter().collection('orders').find({ actionId: req.params.actionId }).toArray((err, result) => {
      if (err) return console.log(err)
      result.forEach(converters.orderFromBson);
      res.send(result)
    });
  });
  
  app.get('/orders/:id', (req, res) => {
    dbGetter().collection('orders').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
      if (err) return console.log(err)
      if (!result) {
        res.sendStatus(404);
        return;
      }
      converters.orderFromBson(result);
      res.send(result)
    });
  });

  app.get('/actions/:actionId/myorders', (req, res) => {
    dbGetter().collection('orders').findOne({ actionId: req.params.actionId, ownerId: req.query.forUser }, (err, result) => {
      console.log('find one');
      if (err) return console.log(err)
      if (!result) {
        res.sendStatus(404);
        return;
      }
      converters.orderFromBson(result);
      res.send(result)
    });
  });

  app.post('/orders', (req, res) => {
    const data = req.body;
    const newProducts = data.newProducts;
    delete data.newProducts;
    converters.orderToBson(data);
    dbGetter().collection('orders').insertOne(data, (err, result) => {
      if (err) return res.send(err);
      updateAction(data.actionId, newProducts, res);
    });
  });

  app.put('/orders/:id', (req, res) => {
    const data = req.body;
    const newProducts = data.newProducts;
    delete data.newProducts;
    converters.orderToBson(data);
    dbGetter().collection('orders')
      .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id), ownerId: req.user.id }, {
        $set: data
      }, {
        upsert: true
      }, (err, result) => {
        if (err) return res.status(500).send(err);
        if (!result) return res.sendStatus(404);
        updateAction(data.actionId, newProducts, res);
      });
  });

  app.delete('/orders/:id', (req, res) => {
    dbGetter().collection('orders')
      .findOneAndDelete({ _id: new mongo.ObjectID(req.params.id), ownerId: req.user.id }, (err, result) => {
        if (err) return res.send(500, err);
        if (!result) return res.sendStatus(404);
        res.send({msg: 'order deleted'});
      });
  });

  app.get('/userorders', (req, res) => {
    dbGetter().collection('orders').find({ ownerId: req.query.forUser }).toArray((err, orders) => {
      if (err) return console.log(err)

      let actionIds = orders.map((order) => new mongo.ObjectID(order.actionId));
      dbGetter().collection('actions').find({ _id: { $in: actionIds } }).toArray((err, actions) => {
        if (err) return console.log(err)
        actions.forEach(converters.actionFromBson);
        orders.forEach((order) => {
          converters.orderFromBson(order);
          order['action'] = actions.find((action) => action.id == order.actionId);
        });
        res.send(orders);
      });
    });
  });

  app.post('/order/picked', (req, res) => {
    dbGetter().collection('orders')
      .findOneAndUpdate({ _id: new mongo.ObjectID(req.body.id), ownerId: req.user.id }, {
        $set: { picked: req.body.picked }
      }, (err, result) => {
        if (err) return res.status(500).send(err);
        if (!result) return res.sendStatus(404);
        res.send(result)
      });
  });

  function updateAction(id, newProducts, res) {
    dbGetter().collection('actions')
      .findOneAndUpdate({ _id: new mongo.ObjectID(id) }, {
        $push: { products: { $each: newProducts } }
      }, {
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      });
  }
}