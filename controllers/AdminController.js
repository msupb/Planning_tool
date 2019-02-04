const UserModel = require('../models/user');
const PlanModel = require('../models/plan');
const bcrypt = require('bcryptjs');

//Render admin login page
module.exports.index = (req, res) => {
  res.render('admin/login', { csrfToken: req.csrfToken() });
};

//Render admin dashboard
module.exports.dashboard = (req, res) => {
  res.render('admin/dashboard', { csrfToken: req.csrfToken() });
};

//Get all users from the database
module.exports.getUsers = (req, res) => {
  const user = req.user.first_name;
  UserModel.User.findAll().then(users => {
    const data = [];
    for (let i = 0; i < users.length; i++) {
      data.push({
        id: users[i].id,
        first_name: users[i].first_name,
        last_name: users[i].last_name,
        email: users[i].email,
        role: users[i].email,
        csrfToken: req.csrfToken()
      });
    }
    res.render('user/users', {
      data: data,
      user: user,
      csrfToken: req.csrfToken()
    });
  });
};

//Find specific user with belonging plans
module.exports.getUser = (req, res) => {
  UserModel.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    PlanModel.Plan.findAll({
      where: {
        userId: user.id
      }
    }).then(plan => {
      const plans = [];
      for(let i = 0; i < plan.length; i++) {
        plans.push({
          id: plan[i].id,
          plan_name: plan[i].plan_name,
          description: plan[i].description,
          csrfToken: req.csrfToken()
        });
      };
      res.render('user/show', {
        data: user,
        plans: plans
      });
      console.log(plan);
    });
  });
};

//Render edit page for specific user and send user data to the view
module.exports.edit = (req, res) => {
  UserModel.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    res.render('user/edit', {
      data: user,
      csrfToken: req.csrfToken()
    });
  });
};

//Update specific user
module.exports.update = (req, res) => {
  const generateHash = function(password) {
    return bcrypt.hash(password, 12)
  };
  generateHash(req.body.password).then(function(hash) {
    UserModel.User.update({
      email: req.body.email,
      password: hash,
      first_name: req.body.fname,
      last_name: req.body.lname,
      role: req.body.role
    }, {
      where: {
        id: req.params.id
      }
    }).then(user => {
      res.redirect('/users');
    });
  });
};

//Delete specific user
module.exports.delete = (req, res) => {
  UserModel.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(deletedPlan => {
    res.redirect('/users');
  });
}
