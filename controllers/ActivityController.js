const ActivityModel = require('../models/activity');
const PlanModel = require('../models/plan');

//Get specific activity for editing
module.exports.edit = (req, res) => {
  ActivityModel.Activity.findOne({
    where: {
      id: req.params.id
    }
  }).then(activity => {
    res.render('activity/edit', {
      dataEdit: activity,
      csrfToken: req.csrfToken()
    });
  });
};

//Create activity/activities
module.exports.create = async (req, res) => {
  try {
    const plan_id = req.body.plan_id;
    console.log('HHEEEEEEEELLLLOOOOO');
    console.log(req.body.idx.length);
    console.log('INDEX=' + req.body.idx);
    if(req.body.idx.length <= 1) {
      let activities = {
        activity_name: req.body.activities[0].name,
        comment: req.body.activities[0].comment,
        plans_id: plan_id
      };

      await ActivityModel.Activity.create(activities);
      console.log('insert succeeded');
      res.redirect('/plans/edit/' + plan_id);
    }
    let activities = req.body.activities[0].name.map(
      (name, i) => {
        return {
          activity_name: name,
          comment: req.body.activities[0].comment[i],
          plans_id: plan_id
        }
      });
    await ActivityModel.Activity.bulkCreate(activities);
    
    res.redirect('/plans/edit/' + plan_id);
  }
  catch(error) {
    res.send(error);
  }
};

//Update specific activity
module.exports.update = (req, res) => {
  const plans_id = req.body.plans_id;
  console.log('THIS IS THE ID ' + plans_id);
  ActivityModel.Activity.update({
    activity_name: req.body.activity_name,
    comment: req.body.comment
  }, {
    where: {
      id: req.params.id
    }
  }).then(plan => {
    res.redirect('/plans/edit/' + plans_id);
  });
};

//Delete specific activity
module.exports.delete = (req, res) => {
  ActivityModel.Activity.findOne({
    where: {
      id: req.params.id
    }
  }).then(activity => {
    PlanModel.Plan.findOne({
      where: {
        id: activity.plans_id
      }
    }).then(plan => {
      ActivityModel.Activity.destroy({
        where: {
          id: req.params.id
        }
      }).then(deletedPlan => {
        console.log(deletedPlan)
        res.redirect('/plans/edit/'+plan.id);
      });
    });
  });
};
