//Load dependencies
const express = require('express');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verify = require('../modules/verifyToken');
const PlanModel = require('../models/plan');
const ActivityModel = require('../models/activity');

//Export router
const router = module.exports.router = express.Router();

//Use bodyparser middleware
router.use(bodyParser.json());

//Login
router.post('/login', async (req, res, err) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user = await UserModel.User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      res.status(400);
      res.json({
        error: "invalid_grant"
      });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400);
      res.json({
        error: "invalid_grant"
      });
      return;
    }
    jwt.sign({
      user_id: user.id
    }, 'kingofthemonkeys', (err, id_token) => {
      const access_token = jwt.sign({ user_role: user.role }, 'kingofthemonkeys');
      res.status(200);
      res.json({
        access_token: access_token,
        token_type: 'Bearer',
        id_token: id_token
      });
    });
  } catch (err) {
    console.log(err)
    res.send(err);
  }
});

 //View all plans belonging to the specific user
router.get('/plans', verify.verifyAccessToken, (req, res) =>{
  jwt.verify(req.headers.id, 'kingofthemonkeys', (err, data) => {
    PlanModel.Plan.findAll({
      where: {
        userId: data.user_id
      }
    }).then(plans => {
      const plansData = [];
      for (let i = 0; i < plans.length; i++) {
        plansData.push({
          id: plans[i].id,
          plan_name: plans[i].plan_name,
          description: plans[i].description,
          userId: plans[i].userId
        });
      }
      res.status(200);
      res.json(plansData);
    });
  });
});

//View specific plan
router.get('/plan/:id', verify.verifyAccessToken, (req, res) => {
  jwt.verify(req.headers.id, 'kingofthemonkeys', (err, data) => {
    PlanModel.Plan.findOne({
      where: {
        id: req.params.id
      }
    }).then(plan => {
      ActivityModel.Activity.findAll({
        where: {
          plans_id: req.params.id
        }
      }).then(activity => {
        const activities = [];
        for(let i = 0; i < activity.length; i++) {
          activities.push({
            id: activity[i].id,
            activity_name: activity[i].activity_name,
            comment: activity[i].comment,
          });
        };
        res.status(200);
        res.json({
          data: plan,
          activity: activities
        });
      });
    });
  });
});

//Create new plan with belonging activities
router.post('/plan', verify.verifyAccessToken, (req, res) =>{
  jwt.verify(req.headers.id, 'kingofthemonkeys', async (err, data) => {
    try {
      const planData = {
        plan_name: req.body.plan_name,
        description: req.body.description,
        userId: data.user_id
      };
      const plan = await PlanModel.Plan.create(planData);
      const activities = [];
      for(let i = 0; i < req.body.activities.length; i++) {
        activities.push({
          activity_name: req.body.activities[i].activity_name,
          comment: req.body.activities[i].comment,
          plans_id: plan.id
        });
      };
      console.log(activities);
      await ActivityModel.Activity.bulkCreate(activities);
      res.status(200);
      res.json('Successfull insert');
    }
    catch(error) {
      res.json(error);
    }
  });
});

//Update specific plan
router.put('/plan/update/:id', verify.verifyAccessToken, (req, res) =>{
  PlanModel.Plan.update({
    plan_name: req.body.plan_name,
    description: req.body.description
  }, {
    where: {
      id: req.params.id
    }
  }).then(plan => {
    res.status(200);
    res.json('Successfull update');
  });
});

//Update specific activity
router.put('/activity/update/:id', verify.verifyAccessToken, (req, res) =>{
  ActivityModel.Activity.update({
    activity_name: req.body.activity_name,
    comment: req.body.comment
  }, {
    where: {
      id: req.params.id
    }
  }).then(plan => {
    res.status(200);
    res.json('Successfull update');
  });
});

//Delete plan by id
router.delete('/plan/delete/:id', verify.verifyAccessToken, (req, res) =>{
    PlanModel.Plan.destroy({
      where: {
        id: req.params.id
      }
    }).then(deletedPlan => {
      res.status(200);
      res.json('Plan deleted');
    });
});

//Delete activity by id
router.delete('/activity/delete/:id', verify.verifyAccessToken, (req, res) =>{
    ActivityModel.Activity.destroy({
      where: {
        id: req.params.id
      }
    }).then(deletedActivity => {
      res.status(200);
      res.json('Activity deleted');
    });
});
