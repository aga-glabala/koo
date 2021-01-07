const mongo = require('mongodb');
const CustomStrategy = require('passport-custom');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const converters = require('./../converters');

module.exports = function (app, dbGetter) {
  passport.use(new CustomStrategy(
    function (req, done) {
      getUser(req.body.email, req.body.password, function (err, user) {
        return done(err, user);
      });
    })
  );

  app.post('/auth/login', passport.authenticate('custom', { session: false }), (req, res) => {
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

  function getUser(email, pwd, cb) {
    return dbGetter().collection('users').findOne({
      'email': email
    }, function (err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = {
          email: email,
          password: pwd,
          accepted: true,
          lastLogin: new Date().getTime()
        };

        dbGetter().collection('users').insertOne(newUser, function (error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser.ops[0]);
        });
      } else if (user.password == pwd) {
        return cb(err, user);
      } else {
        return cb("Invliad password");
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

  app.get('/auth/me', (req, res, next) => {
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
}