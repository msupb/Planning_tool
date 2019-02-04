const jwt = require('jsonwebtoken');

/*module.exports.verifyToken = function(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403);
    res.json('Forbidden');
  }
}*/

//Verifies the user access token and checks the user rights
module.exports.verifyAccessToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    var bearerToken = bearer[1];
  } else {
    res.status(403);
    res.json('Forbidden');
    return;
  }
  jwt.verify(bearerToken, 'kingofthemonkeys', (err, data) => {
    console.log(data);
    if (err) {
      res.status(403);
      res.json('Forbidden');
      return;
    }
    if(data.user_role === 'user' || data.user_role === 'admin') {
      return next();
    } else {
      res.json('401 Unauthorized');
    }
  });
}
