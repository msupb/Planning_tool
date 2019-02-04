const Sequelize = require('sequelize');
const db = require('../config/database');
const Plan = require('./plan');

module.exports.User = db.sequelize.define('users', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.STRING,
});

//User.hasMany(Plan.Plan)

//user.setPlan()

//module.exports.User = User
