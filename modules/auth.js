//Check if user is logged in, otherwise redirect to login page
module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

//Check if user has admin rights
module.exports.authAdmin = function(req, res, next) {
  const user = req.user;
  if (user && req.user.role === 'admin') return next();
  res.redirect(401, '/unauthorized');
};

//Check if user has user or admin rights
module.exports.authUser = function(req, res, next) {
  const user = req.user;
  if (user && req.user.role === 'user' || user && req.user.role === 'admin') return next();
  res.redirect(401, '/unauthorized');
};
