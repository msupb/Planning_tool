//Load dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const methodOverride = require('method-override')
const UserModel = require('./models/user');
const PlanModel = require('./models/plan');
const isAuth = require('./modules/auth');
const api = require('./api/api');

const app = express();
const csrfProtection = csrf();
const port = process.env.PORT || '3000';

//Set static directory for views
const hbs = exphbs.create({
  extname: 'hbs',
  layoutsDir: './views/layouts',
  defaultLayout: 'layout'
});

//Initiate api route
app.use('/api', api.router);

//Set hbs to default view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Use middleware bodyparser for parsing json data and method override to allow put and delete from html forms
app.use(methodOverride('_method'));
app.use('/assets', express.static('assets'));
app.use(bodyParser.json());
//Extended set to true to enable bulk insert of activities
app.use(bodyParser.urlencoded({
  extended: true
}));

//Set session details and initiate sessions
app.use(session({
  secret: 'monkey',
  resave: false,
  saveUninitialized: false
}));
//Inject passport and passport session to app
app.use(passport.initialize());
app.use(passport.session());
//Inject csrf into app for validating data posted to db and set error message if token is invalid
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  console.log(err);
  res.send('Invalid csrf token');
});

//Initiate web app routes
require('./routes/auth/authRoute')(app, isAuth, passport);
require('./config/passport')(passport, UserModel.User);
require('./routes/planRoute')(app, isAuth);
require('./routes/activityRoute')(app, isAuth);
require('./routes/admin/adminRoute')(app, isAuth, passport);

app.listen(port, () => {
  console.log('Listening to ' + port);
});
