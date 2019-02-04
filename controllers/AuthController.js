const PlanModel = require('../models/plan');

//Render index page
module.exports.index = (req, res) => {
  res.render('index');
};

//Render login page and send csrf token
module.exports.login = (req, res) => {
  res.render('auth/login', { csrfToken: req.csrfToken() });
};

//Render register page and send csrf token
module.exports.register = (req, res) => {
  res.render('auth/register', { csrfToken: req.csrfToken() });
};

//Logout and destroy session
module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
