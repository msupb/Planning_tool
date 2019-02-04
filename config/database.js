const Sequelize = require('sequelize');
//Set database connection details
const db = 'planning_tool';
const user = 'root';
const password = '';

//Create new instance of Sequelize using connection details
exports.sequelize = new Sequelize(db, user, password, {
    define: {
      timestamps: false
    },
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

  });

exports.sequelize
    .authenticate()
    .then(() => {
      console.log('Connection to MySQL DB has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
