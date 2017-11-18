const express = require('express');
const router = express.Router();
const categories = require('./Categories');
const db = require('../../models');
const Items = db.Item;
const Category = db.Category;
const Condition = db.Condition;
const Status = db.Status;
const User = db.User;

router.get('/', (req, res) => {
  return Category.findAll()
  .then((categories) => {
    res.json(categories);
  });
});

router.get('/:cid', (req, res) => {
  return Items.findAll({include:[
    {model: Category, as: 'Category'},
    {model: Condition, as: 'Condition'},
    {model: User, as: 'User'},
    {model: Status, as: 'Status'}
    ],
    where: {
      category_id: req.params.cid,
      status_id: 1
    }
  })
  .then((items) => {
    res.json(items);
  })
  .catch((error) => {
    console.log(items);
  });
});

router.get('/:cid/item/:id', (req, res) => {
  return Items.findOne({include:[
    {model: Category, as: 'Category'},
    {model: Condition, as: 'Condition'},
    {model: User, as: 'User'},
    {model: Status, as: 'Status'}
    ],
    where:{
      id: req.params.id,
      status_id: 1
    }
  })
  .then((item) => {
    res.json(item);
  })
  .catch((error) => {
    console.log(error);
  });
});

module.exports = router;