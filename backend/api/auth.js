const mongo = require('mongodb');
const FacebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

const converters = require('./../converters');

module.exports = function (app, dbGetter) {
  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET
  },
    function (accessToken, refreshToken, profile, done) {
      upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
        return done(err, user);
      });
    })
  );

  passport.use(new LocalStrategy(
    function(username, password, done) {
      dbGetter().collection('users').findOne({ login: username, password: password }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.password === password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  app.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    const token = createToken(req.user);
    res.status(200).send({ token, profile: converters.userFromBson(req.user) });
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
    return dbGetter().collection('users').findOne({
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
          accepted: false,
          lastLogin: new Date().getTime()
        };

        dbGetter().collection('users').insertOne(newUser, function (error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser.ops[0]);
        });
      } else {
        return cb(err, user);
      }
    });
  };

  app.post('/auth/refreshToken', (req, res) => {
    dbGetter().collection('users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(req.user.id) }, 
      { $set: { lastLogin: new Date().getTime() } },
      function (err, result) {
        if (err) {
          res.send(500);
        } else if (!result.value) {
          res.sendStatus(404);
        } else {
          const token = createToken(result.value);
          res.status(200).send({ token, profile: converters.userFromBson(result.value) });
        }
      });
  });

  app.get('/auth/me', (req, res, next) => {;
    dbGetter().collection('users').findOne({ _id: new mongo.ObjectID(req.user.id) }, function (err, user) {
      if (err) {
        res.send(500);
      } else if (user) {
        converters.userFromBson(user);
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    });
  });

  app.post('/auth/loginForm', passport.authenticate('local', { session: false }), (req, res) => {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      const token = createToken(req.user);
      res.status(200).send({ token, profile: converters.userFromBson(req.user) });
  });
}