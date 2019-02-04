const AdminController = require('../../controllers/AdminController');

module.exports = (app, isAuth, passport) => {
  //Get admin login page
  app.get('/admin', AdminController.index);

  //Post login details and process data through passport local login strategy
  app.post('/admin', passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/admin'
  }));

  //Register user and process through passport local register strategy
  app.post('/user/create', isAuth.isLoggedIn, isAuth.authUser, passport.authenticate('register', {
    successRedirect: '/users',
    failureRedirect: '/users'
  }));

  app.get('/dashboard', isAuth.isLoggedIn, isAuth.authAdmin, AdminController.dashboard);

  app.get('/users', isAuth.isLoggedIn, isAuth.authAdmin, AdminController.getUsers);

  app.get('/users/:id', isAuth.isLoggedIn, isAuth.authUser, AdminController.getUser);

  app.get('/user/edit/:id', isAuth.isLoggedIn, isAuth.authUser, AdminController.edit);

  app.put('/user/update/:id', isAuth.isLoggedIn, isAuth.authUser, AdminController.update);

  app.delete('/user/delete/:id', isAuth.isLoggedIn, isAuth.authUser, AdminController.delete);

}
