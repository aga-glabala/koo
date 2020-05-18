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

module.exports = function (app, dbGetter) {
  app.get('/actions', (req, res) => {
    dbGetter().collection('actions').find().toArray((err, result) => {
      if (err) return res.status(500).send(err);
      result.forEach(convertActionFromBson);
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
      convertActionFromBson(result);
      res.send(result)
    });
  });

  app.post('/actions', (req, res) => {
    const data = req.body;
    convertActionToBson(data);
    dbGetter().collection('actions').insertOne(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.redirect('/actions/' + result.insertedId);
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
        res.redirect('/actions/' + actionId);
      });
  });

  app.get('/actions/:id/photos/:photo', (req, res) => {
    res.sendFile(uploadDestination + req.params.photo);
  });

  app.put('/actions/:id', (req, res) => {
    const data = req.body;
    convertActionToBson(data);
    dbGetter().collection('actions')
      .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id), 'createdBy.id': req.user.id }, {
        $set: data
      }, {
        upsert: true
      }, (err, result) => {
        if (err) return res.status(500).send(err);
        if (!result) return res.sendStatus(404);
        const data = req.body;
        convertActionFromBson(data);
        res.send(data)
      });
  });

  app.delete('/actions/:id', (req, res) => {
    dbGetter().collection('actions')
      .findOneAndDelete({ _id: new mongo.ObjectID(req.params.id), 'createdBy.id': req.user.id }, (err, result) => {
        if (err) return res.send(500, err);
        if (!result) return res.sendStatus(404);
        res.send('A darth vadar quote got deleted')
      });
  });

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
}