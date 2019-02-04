const AuthController = require('../../controllers/AuthController');

module.exports = function(app, isAuth, passport, plan) {
  //Get startpage
  app.get('/', AuthController.index);

  //Get login page
  app.get('/login', AuthController.login);

  //Get register page
  app.get('/register', AuthController.register);

  //Register user and process data through passport local register strategy
  app.post('/register', passport.authenticate('register', {
    successRedirect: '/plans',
    failureRedirect: '/register'
  }));

  //Login and process data through passport local login strategy
  app.post('/login', passport.authenticate('login', {
    successRedirect: '/plans',
    failureRedirect: '/login'
  }));

  //Logout and destroy session
  app.get('/logout', AuthController.logout);

};
