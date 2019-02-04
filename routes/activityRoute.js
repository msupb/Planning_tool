const ActivityController = require('../controllers/ActivityController');

module.exports = function(app, isAuth) {
  //Delete activity
  app.delete('/activity/delete/:id', isAuth.isLoggedIn, isAuth.authUser, ActivityController.delete);

  //Get specific activity for editing
  app.get('/activity/edit/:id', isAuth.isLoggedIn, isAuth.authUser, ActivityController.edit);

  //Create activity/activities
  app.post('/activity/create', isAuth.isLoggedIn, isAuth.authUser, ActivityController.create);

  //Update specific activity
  app.put('/activity/update/:id', isAuth.isLoggedIn, isAuth.authUser, ActivityController.update);
}
