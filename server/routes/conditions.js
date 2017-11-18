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
  Condition.findAll()
  .then((conditions) => {
    res.json(conditions);
  });
});

module.exports = router;