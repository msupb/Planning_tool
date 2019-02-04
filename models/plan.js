const Sequelize = require('sequelize');
const db = require('../config/database');
//const User = require('./user');

module.exports.Plan = db.sequelize.define('plans', {
  plan_name: Sequelize.STRING,
  description: Sequelize.STRING,
  userId: Sequelize.INTEGER
});

//module.exports.Plan.belongsTo(User)

/*Plan.findById(123).then(function(plan){
  plan.getUser().then(function(user){

  })
})*/
