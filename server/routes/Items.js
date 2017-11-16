const express = require('express');
const app = express();
const router = express.Router();
const items = require('./Items');
const db = require('../../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Items = db.Item;
const Category = db.Category;
const Condition = db.Condition;
const Status = db.Status;
const User = db.User;

const IMAGES_STUB = 'uploads/items';
const TMP_STUB = 'temp/uploads/images/';

const upload = multer({
  dest: TMP_STUB,
  limits: { fileSize: 2000000 },
  files: 1
});

app.use(express.static(path.join( __dirname, '../../public')));

router.post('/new',  isAuthenticated, upload.single('file'), (req, res) => {
  let data = req.body;
  console.log(req.file)

  const { originalname, path: tempPath } = req.file;
  fileName = originalname.replace(/\s+/g, '_');


  return Items.create({
    name: data.name,
    body: data.body,
    price: data.price,
    category_id: data.category_id,
    condition_id: data.condition_id,
    user_id: req.user.id,
    status_id: 1
  })
  .then((newItem) => {
    const itemID = newItem.id.toString();
    return moveImageUpload(itemID, fileName, tempPath, IMAGES_STUB)
    .then((imagePath) => {
      console.log(imagePath);
      return Items.update({
        file: '/' + imagePath
      }, {
        where: {
          id: newItem.id
        }
      })
      .then((updatedItem) => {
        return Items.findOne({
          where: {
            id: newItem.id
          }
        })
        .then((item) => {
          return res.json(item)
        })
      })
    });
  })
  .catch((error) => {
    console.log(error);
  });
});

router.get('/', (req, res) => {
  return Items.findAll({include:[
    {model:Category, as: 'Category'},
    {model: Condition, as: 'Condition'},
    {model: User, as: 'User'},
    {model: Status, as: 'Status'}
    ],
    where: {
      status_id: 1
    },
    order: [['updatedAt', 'DESC']]})
  .then((items) => {
    return res.json(items);
  })
  .catch((error) => {
    console.log(error);
  });
});

router.get('/:id', (req, res) => {
  return Items.findOne({include:[
    {model:Category, as: 'Category'},
    {model: Condition, as: 'Condition'},
    {model: User, as: 'User'},
    {model: Status, as: 'Status'}
    ],
    where: {
      id: req.params.id
    }
  })
  .then((item) => {
    return res.json(item);
  })
  .catch((error) => {
    console.log(error);
  });
});

router.put('/:id', isAuthenticated, upload.single('file'), (req, res) => {
  //here image will default to generic stock photo if no image is uploaded

    const { originalname, path: tempPath } = req.file;
    fileName = originalname.replace(/\s+/g, '_');


  return Items.findOne({
    where: {
      id: req.body.id
    }
  })
  .then((item) => {
    const itemID = item.id.toString();
    let data = req.body;
    return moveImageUpload(itemID, fileName, tempPath, IMAGES_STUB)
    .then((imagePath) => {
      if(req.user.id === item.user_id){
        return Items.update({
          name: data.name || item.name,
          file: imagePath || item.file,
          body: data.body || item.body,
          price: data.price || item.price,
          category_id: data.category_id || item.category_id,
          condition_id: data.condition_id || item.condition_id
          },
          {where:{
            id: req.body.id
          }
          })
        }
      })
      .then((response) => {
        return Items.findOne({include:[
          {model: Category, as: 'Category'},
          {model: Condition, as: 'Condition'},
          {model: User, as: 'User'},
          {model: Status, as: 'Status'}
          ],
          where: {
            id: req.body.id
          }
        })
        .then((updatedItem) => {
          return res.json(updatedItem);
        });
      });
  })
  .catch((error) => {
    console.log(error);
  });
});

router.delete('/:id', isAuthenticated, (req, res) => {
  return Items.findOne({
    where: {
      id: req.params.id
    }
  })
  .then((item) => {
    //check req.user is right
    if(req.user.id === item.user_id){
      return Items.update({
        status_id: 2
      },
      {where:{
        id: req.params.id
      }
      })
      .then((response) => {
        return Items.findOne({include:[
          {model: Category, as: 'Category'},
          {model: Condition, as: 'Condition'},
          {model: User, as: 'User'},
          {model: Status, as: 'Status'}
          ],
          where: {
            id: req.params.id
          }
        })
        .then((soldItem) => {
          return res.json(soldItem);
        });
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });
});

function isAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    console.log('isAuthenticated');
    next();
  } else {
    console.log('not isAuthenticated');
    res.redirect('/')
  }
}

function moveImageUpload(itemID, fileName, tempFilePath, targetStub){
  return new Promise((resolve, reject) => {
    const targetPathStub = path.join(targetStub, itemID);
    console.log('targetPathStub', targetPathStub);
    const targetPathFull = path.join(__dirname, '../../public', targetPathStub);
    console.log('targetPathFull', targetPathFull);
    const sourcePathFull = path.join(__dirname, '..', '..', tempFilePath);
    console.log('sourcePathFull', sourcePathFull);

    fs.mkdir(targetPathFull, (err) => {
      if(err && err.code !== 'EEXIST'){
        reject(err);
      }
      fs.rename(sourcePathFull, path.join(targetPathFull, fileName), (err) => {
        if(err) reject(err);
        resolve(path.join(targetPathStub, fileName));
      });
    });
  });
}

module.exports = router;