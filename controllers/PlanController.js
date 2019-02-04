const PlanModel = require('../models/plan');
const ActivityModel = require('../models/activity');

//Retrieve all plans belonging to a specific user from database
module.exports.getPlans = (req, res) => {
  const user = req.user.first_name;
  const user_id = req.user.id;
  PlanModel.Plan.findAll({
    where: {
      userId: user_id
    }
  }).then(plans => {
    const data = [];
    for (let i = 0; i < plans.length; i++) {
      data.push({
        id: plans[i].id,
        plan_name: plans[i].plan_name,
        description: plans[i].description,
        test: [],
        userId: plans[i].userId,
        csrfToken: req.csrfToken()
      });
    }
    ActivityModel.Activity.findAll({}).then(activity => {
     /* const activities = [];
      for(let i = 0; i < activity.length; i++) {
        activities.push({
          id: activity[i].id,
          activity_name: activity[i].activity_name,
          comment: activity[i].comment,
          plans_id: activity[i].plans_id
        });
      };*/
      for(let i = 0; i < data.length; i++) {
        for(let z = 0; z < activity.length; z++) {
          if(data[i].id == activity[z].plans_id) {
            data[i].test.push({
              id: activity[z].id,
              activity_name: activity[z].activity_name,
              comment: activity[z].comment,
              plans_id: activity[z].plans_id
            });
          }
        }
      }
      console.log(data);      
      res.render('plan/plans', {
        data: data,
        user: user,
        csrfToken: req.csrfToken()
      });
    });
  });
};

//Get specific plan with belonging activities
module.exports.getPlan = (req, res) => {
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
          csrfToken: req.csrfToken()
        });
      };
      res.render('plan/show', {
        data: plan,
        activity: activities
      });
      console.log(activity);
    });
  });
};

//Create new plan with belonging activities
module.exports.create = async (req, res) => {
  try {
    const data = {
      plan_name: req.body.plan_name,
      description: req.body.description,
      userId: req.user.id
    };
    const plan = await PlanModel.Plan.create(data);
    console.log('HHEEEEEEEELLLLOOOOO');
    console.log(req.body.idx.length);
    console.log('INDEX=' + req.body.idx);
    if(req.body.idx <= 1) {
      let activities = {
        activity_name: req.body.activities[0].name,
        comment: req.body.activities[0].comment,
        plans_id: plan.id
      };

      await ActivityModel.Activity.create(activities);
      console.log('insert succeeded');
      res.redirect('/plans');
    }
    let activities = req.body.activities[0].name.map(
      (name, i) => {
        return {
          activity_name: name,
          comment: req.body.activities[0].comment[i],
          plans_id: plan.id
        }
      });
      await ActivityModel.Activity.bulkCreate(activities);
      console.log('bulk insert succeeded');
      res.redirect('/plans');
  }
  catch(error) {
    res.send(error);
  }
};

//Load edit view
module.exports.edit = (req, res) => {
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
          plans_id: activity[i].plans_id,
          csrfToken: req.csrfToken()
        });
      };
      res.render('plan/edit', {
        data: plan,
        activity: activities,
        csrfToken: req.csrfToken()
      });
      console.log(activity);
    });
  });
};

//Update specific plan
module.exports.update = (req, res) => {
  PlanModel.Plan.update({
    plan_name: req.body.plan_name,
    description: req.body.description
  }, {
    where: {
      id: req.params.id
    }
  }).then(plan => {
    res.redirect('/plans');
  });
};

//Delete specific plan
module.exports.delete = (req, res) => {
  PlanModel.Plan.destroy({
    where: {
      id: req.params.id
    }
  }).then(deletedPlan => {
    res.redirect('/plans');
  });
};
