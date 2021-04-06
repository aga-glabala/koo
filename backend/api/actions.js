const mongo = require('mongodb');

const multer = require('multer');
const path = require('path');

const uploadDestination = path.normalize(__dirname + '/../uploads/images/');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + path.extname(file.originalname))
  }
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype.indexOf('image') !== 0) {
    cb(null, false);
    return;
  }
  cb(null, true);
}
const upload = multer({ storage, fileFilter });

const converters = require('./../converters');
const calcSum = require('./../calcOrders');

module.exports = function (app, dbGetter) {
  app.get('/actions', (req, res) => {
    let orderby = {'createdOn': 1};
    switch (req.query.sort) {
      case 'newest': 
        orderby = {'createdOn': -1}
        break;
      case 'oldest': 
        orderby = {'createdOn': 1}
        break;
      case 'order': 
        orderby = {'orderDate': 1}
        break;
      case 'pay': 
        orderby = {'payDate': 1}
        break;
      case 'collection': 
        orderby = {'collectionDate': 1}
        break;
    }

    let query = {};
    if(req.query.archived === 'false') {
      query.collectionDate = {$gte: new Date().getTime()};
    }

    if(req.query.search) {
      query.name = new RegExp('.*' + req.query.search + '.*', 'i');
    }

    dbGetter().collection('actions').find(query).sort(orderby).toArray((err, result) => {
      if (err) return res.status(500).send(err);
      result.forEach(converters.actionFromBson);

      res.send(result)
    });
  });

  app.get('/actions/user/:userid', (req, res) => {
    dbGetter().collection('actions').find({'createdBy.id': req.params.userid}).sort({'created_on': 1}).toArray((err, result) => {
      if (err) return res.status(500).send(err);
      result.forEach(converters.actionFromBson);

      res.send(result)
    });
  });

  app.get('/actions/:id', (req, res) => {
    dbGetter().collection('actions').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
      if (err) return res.sendStatus(404);
      if (!result) {
        res.sendStatus(404);
        return;
      }
      converters.actionFromBson(result);
      dbGetter().collection('orders').find({ actionId: req.params.id }).count((err, ordersCount) => {
        if (err) return console.log(err)
        
        result.ordersCount = ordersCount;
        res.send(result);
      });
    });
  });

  app.post('/actions', (req, res) => {
    const data = converters.actionToBson(req.body);
    dbGetter()
      .collection('users')
      .findOne({ _id: new mongo.ObjectID(req.user.id) })
      .then(result => {
        const user = converters.userFromBson(result);
        data.createdBy = {id: user.id, name: user.name, photoUrl: user.photoUrl};
        if (data.cost > 0) {
          data.payLock = true;
        }
        
        dbGetter().collection('actions').insertOne(data, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.send({id: result.insertedId});
        });
      });
  });

  app.put('/actions/:id', (req, res) => {
    const data = converters.actionToBson(req.body);

    if (data.cost > 0) {
      data.payLock = true;
    }
    
    dbGetter().collection('actions')
      .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id), 'createdBy.id': new mongo.ObjectID(req.user.id) }, {
        $set: data
      }, (err, result) => {
        if (err) return res.status(500).send(err);
        if (!result) return res.sendStatus(404);
        const data = req.body;
        converters.actionFromBson(data);
        res.send(data)
      });
  });

  app.post('/actions/:id/photos', upload.array('photos[]', 100), (req, res) => {
    const actionId = req.params.id;
    let photos = req.files.map(file => file.filename);
    dbGetter().collection('actions')
      .findOneAndUpdate({ _id: new mongo.ObjectID(actionId), 'createdBy.id': req.user.id }, {
        $set: { photos }
      }, {
      }, (err, result) => {
        if (err) return res.status(500).send(err);
        if (!result) return res.sendStatus(404);
        res.send({id: actionId});
      });
  });

  app.get('/actions/:id/photos/:photo', (req, res) => {
    res.sendFile(uploadDestination + req.params.photo);
  });

  app.delete('/actions/:id', (req, res) => {
    dbGetter().collection('actions')
      .findOneAndDelete({ _id: new mongo.ObjectID(req.params.id), 'createdBy.id': req.user.id }, (err, result) => {
        if (err) return res.send(500, err);
        if (!result) return res.sendStatus(404);
        dbGetter().collection('orders').deleteMany({actionId: req.params.id}, (err, result) => {
          if (err) return res.send(500, err);
          res.send({msg: 'Action deleted'});
        });
      });
  });

  app.get('/actions/paySign/:id', (req, res) => {
    // TODO wysyłać powiadomienia, zrobić transakcje a najlepiej przenieść do ORM
    dbGetter().collection('actions').findOne({ _id: new mongo.ObjectID(req.params.id), 'createdBy.id': new mongo.ObjectID(req.user.id) }, (err, action) => {
      if (err) return res.sendStatus(404);
      if (!action) {
        res.status(404).send({msg: `Akcja nie znaleziona lub ma innego właściciela (${req.params.id}, ${req.user.id})`});
        return;
      }

      dbGetter().collection('orders').find({ actionId: req.params.id }).toArray((err, orders) => {
        if (err) return console.log(err)
        
        let orderCost = 0; 
        if (orders.length > 0) {
          orderCost = action.cost / orders.length;
        }
        orders.forEach((order) => {
          order.calculatedSum = calcSum.calcSum(action, order) + orderCost;
          dbGetter().collection('orders').save(order);
        });
        res.send(orders);
      });

      action.payLock = false;
      action.orderDate = new Date().getTime();
      dbGetter().collection('actions').save(action);
    });
  });
}