const PlanController = require('../controllers/PlanController');

module.exports = function(app, isAuth) {
  //Get all plans belonging to the current user
  app.get('/plans', isAuth.isLoggedIn, isAuth.authUser, PlanController.getPlans);

  //Get specific plan
  app.get('/plans/:id', isAuth.isLoggedIn, isAuth.authUser, PlanController.getPlan);

  //Create plan with belonging activities
  app.post('/plans/create', isAuth.isLoggedIn, isAuth.authUser, PlanController.create);

  //Get edit view for editing a specific plan
  app.get('/plans/edit/:id', isAuth.isLoggedIn, isAuth.authUser, PlanController.edit);

  //Update details about specific plan and send to database
  app.put('/plans/update/:id', isAuth.isLoggedIn, isAuth.authUser, PlanController.update);

  //Delete specific plan
  app.delete('/plans/delete/:id', isAuth.isLoggedIn, isAuth.authUser, PlanController.delete);

}
