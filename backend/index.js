"use strict";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const expressJwt = require('express-jwt');
const guard = require('express-jwt-permissions')()
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.json())

app.use(cors({ origin: process.env.CORS_ORIGIN }));

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
app.use(authenticate.unless({ path: ignoredPaths }));

app.use(guard.check('accepted').unless({ path: ['/auth/me', '/auth/refreshToken', ...ignoredPaths] }));

app.use(function (err, req, res, next) {
  if (err.code === 'permission_denied') {
    res.status(403).send('Forbidden');
  }
});

let db;

mongo.MongoClient.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, database) => {
    if (err) return console.log(err)
    db = database.db(process.env.MONGODB_DB)
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on 3000')
    })
  }
);

const dbGetter = function () {
  return db;
}

require('./api/auth')(app, dbGetter);
require('./api/actions')(app, dbGetter);
require('./api/orders')(app, dbGetter);
require('./api/users')(app, dbGetter, guard);