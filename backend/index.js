"use strict";

const passport = require('passport');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const FacebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const guard = require('express-jwt-permissions')()
const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDestination = __dirname + '/uploads/images/';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + path.extname(file.originalname))
  }
});
const fileFilter = function(req, file, cb) {
  if (file.mimetype.indexOf('image') !== 0) {
    cb(null, false);
    return;
  }
  cb(null, true);
}
const upload = multer({ storage, fileFilter });

const app = express();

app.use(bodyParser.json())

const corsOptions = {
  origin: process.env.CORS_ORIGIN
}
app.use(cors(corsOptions));

//token handling middleware
const authenticate = expressJwt({
  secret: process.env.JWT_SECRET,
  getToken: function (req) {
    if (req.headers.authorization) {
      return req.headers.authorization.replace('Bearer ', '');
    }
    return null;
  }
});

// TODO secure images ?
const ignoredPaths = ['/auth/facebook', /^\/actions\/[a-z0-9]+\/photos\/.*/];
app.use(authenticate.unless({path: ignoredPaths}));

app.use(guard.check('accepted').unless({path: ['/auth/me', ...ignoredPaths]}));

app.use(function (err, req, res, next) {
  if (err.code === 'permission_denied') {
    res.status(403).send('Forbidden');
  }
});

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET
},
  function (accessToken, refreshToken, profile, done) {
    upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }));


  let db;

// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
mongo.MongoClient.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, database) => {
    if (err) return console.log(err)
    db = database.db(process.env.MONGODB_DB)
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on 3000')
    })
  })

// ACTIONS

app.get('/actions', (req, res) => {
  db.collection('actions').find().toArray((err, result) => {
    if (err) return res.status(500).send(err);
    result.forEach(convertActionFromBson);
    res.send(result)
  })
})

app.get('/actions/:id', (req, res) => {
  db.collection('actions').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    if (err) return res.sendStatus(404);
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
    if (err) return res.status(500).send(err);
    res.redirect('/actions/' + result.insertedId);
  })
})

app.post('/actions/:id/photos', upload.array('photos[]', 100), (req, res) => {
  const actionId = req.params.id;
  let photos = req.files.map(file => file.filename);
  db.collection('actions')
  .findOneAndUpdate({ _id: new mongo.ObjectID(actionId) }, {
    $set: { photos }
  }, {
  }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.redirect('/actions/' + actionId);
  });
})

app.get('/actions/:id/photos/:photo', (req, res) => {
  res.sendFile(uploadDestination + req.params.photo);
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
    res.send(result)
  })
})

app.post('/orders', (req, res) => {
  const data = req.body;
  convertOrderToBson(data);
  db.collection('orders').insertOne(data, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database ');
    res.redirect('/orders/' + result.insertedId);
  })
})

app.put('/orders/:id', (req, res) => {
  const data = req.body;
  const newProducts = data.newProducts;
  delete data.newProducts;
  convertOrderToBson(data);
  db.collection('orders')
    .findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, {
      $set: data
    }, {
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      db.collection('actions')
        .findOneAndUpdate({ _id: new mongo.ObjectID(data.actionId) }, {
          $push: {products: {$each : newProducts}}
        }, {
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

  
})

app.delete('/orders/:id', (req, res) => {
  db.collection('orders').findOneAndDelete({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})

app.get('/userorders', (req, res) => {
  db.collection('orders').find({ ownerId: req.query.forUser }).toArray((err, orders) => {
    if (err) return console.log(err)
    
    let actionIds = orders.map((order) =>  new mongo.ObjectID(order.actionId));
    db.collection('actions').find({_id: {$in: actionIds }}).toArray((err, actions) => {
      if (err) return console.log(err)
      actions.forEach(convertActionFromBson);
      orders.forEach((order) => {
        convertOrderFromBson(order);
        order['action'] = actions.find((action) => action.id == order.actionId);
      });
      res.send(orders);
    })
  })
})

app.post('/order/picked', (req, res) => {
  console.log(req.body.id);
  db.collection('orders').findOneAndUpdate({ _id: new mongo.ObjectID(req.body.id) }, {
    $set: {picked: req.body.picked}
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
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

// USERS

app.get('/users', (req, res) => {
  db.collection('users').find({ accepted: req.query.accepted === 'true' }).toArray((err, result) => {
   if (err) return console.log(err)
   result.forEach(convertUserFromBson);
   res.send(result)
  })
});

app.get('/users/:id', (req, res) => {
  db.collection('users').findOne({ _id: new mongo.ObjectID(req.params.id) }, (err, result) => {
    if (err) return console.log(err)
    if (!result) {
      res.sendStatus(404);
      return;
    }
    convertUserFromBson(result);
    res.send(result)
  })
});

app.post('/users/:id/accept', guard.check('admin'), (req, res) => {
  db.collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, {$set: {accepted: true}}, {}, (err, result) => {
    if (err) {
      res.sendStatus(500);
      return console.log(err);
    }
    res.send(result);
  });
});

app.post('/users/:id/makeAdmin', guard.check('admin'), (req, res) => {
  db.collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(req.params.id) }, {$set: {admin: true}}, {}, (err, result) => {
    if (err) {
      res.sendStatus(500);
      return console.log(err);
    }
    res.send(result);
  });
});

function convertUserFromBson(action) {
  action.id = action._id;
  delete action._id;
}

function convertUserToBson(action) {
  if (action.id) {
    action._id = new mongo.ObjectID(action.id);
    delete action.id;
  }
}

// AUTH

app.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}), (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }

  const token = createToken(req.user);
  res.status(200).send({ token, profile: req.user });
});

function createToken(user) {
  const permissions = [
    user.accepted ? "accepted" : undefined,
    user.admin ? "admin" : undefined
  ].filter(a => a);
  return jwt.sign(
    {
      id: user._id,
      permissions,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 7 * 24 * 3600 // 7 days 
    });
};

function upsertFbUser(accessToken, refreshToken, profile, cb) {
  return db.collection('users').findOne({
    'facebookProvider.id': profile.id
  }, function (err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = {
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        },
        name: profile.displayName,
        photoUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
        phone: null,
        admin: false,
        accepted: false
      };

      db.collection('users').insertOne(newUser, function (error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

app.get('/auth/me', (req, res, next) => {
  db.collection('users').findOne({ _id: new mongo.ObjectID(req.user.id) }, function (err, user) {
    if (err) {
      res.send(500);
    } else if (user) {
      convertUserFromBson(user)
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });
});