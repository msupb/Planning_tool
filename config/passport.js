const bcrypt = require('bcryptjs');

module.exports = function(passport, user) {
  const LocalStrategy = require('passport-local').Strategy;
  const User = user;
  //Register strategy for processing register data
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    const generateHash = function(password) {
      return bcrypt.hash(password, 12)
    };
    User.findOne({
      where: {
        email: email
      }
    }).then(function(user) {
      if(user) {
        return done(null, false, {
          message: 'Email already exists'
        });
      } else {
        generateHash(password).then(function(hash) {
          const data = {
            email: email,
            password: hash,
            first_name: req.body.fname,
            last_name: req.body.lname,
            role: req.body.role
          };
          User.create(data).then(function(newUser, created) {
            if (!newUser) return done(null, false);
            if (newUser) return done(null, newUser);
          });
        });
      }
    });
  }));

  //Login strategy for processing login data
  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    console.log(email, password)
    const User = user;
    const isValid = function(hash, password) {
      return bcrypt.compare(password, hash);
    }
    User.findOne({
      where: {
        email: email
      }
    }).then(function(user) {
      if (!user) return done(null, false, {
        message: 'Email does not exist'
      });
      console.log(user)
      isValid(user.password, password)
        .then(function(res) {
          if (res) {
            const userinfo = user.get();
            return done(null, userinfo);
          } else {
            return done(null, false, {
              message: 'Wrong password'
            });
          }
        });
    }).catch(function(err) {
      console.log(err);
      return done(null, false, {
        message: 'Login failed'
      });
    });
  }));

  //Serialize user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //Deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

};
