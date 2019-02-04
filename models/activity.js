const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports.Activity = db.sequelize.define('activities', {
  activity_name: Sequelize.STRING,
  comment: Sequelize.STRING,
  plans_id: Sequelize.INTEGER
});
