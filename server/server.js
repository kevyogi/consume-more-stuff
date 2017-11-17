const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('../models');
const routes = require('./routes');
const path = require('path')
const redis = require('connect-redis')(session);
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const saltRounds = 12;

const PORT = process.env.PORT || 8080;
const app = express();


app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  store: new redis(),
  secret: 'aTeam',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  //console.log('USER', user);
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log(user, 'DESERIAL USER');
  console.log('deserializing');
  db.User.findOne({where: { id: user.id }})
  .then((user) => {
    return done(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  console.log('passport use ==>', username, password);
  db.User.findOne({where: {username: username}})
    .then((user) => {
      if(user === null){
        return done(null, false, {message: 'bad username or password'});
      }else{
        bcrypt.compare(password, user.password)
        .then((res) => {
          if(res){
            var foundUser = user.get();
            delete foundUser.password;
            return done(null, foundUser);
          }else{
            return done(null, false, {message: 'bad username or password'});
          }
        });
      }
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
}));


app.post('/login', passport.authenticate('local'), function(req, res){
  const user = req.user;
  console.log(user, 'SERVER ERROR')
  res.json(req.user);
});

app.put('/users/:id/edit', (req,res) => {
  console.log(req.body, 'edit username route');
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      console.log(hash);
      return db.User.findOne({
        where: {
          id: req.user.id
          }
        })
        .then(user => {
          return db.User.update({
            username: req.body.username || user.username,
            password: hash || user.password,
            email: req.body.email || user.email
          },
          {where: {
            id: req.user.id
            }
          })
          .then(response => {
            return db.User.findOne({
              where : {
                id: req.user.id
              }
            })
            .then(updatedUser => {
            console.log(updatedUser, 'UPDATED UPDATED');
            return res.json(updatedUser);
          });
        });
      });
    });
  });
});



app.use('/api', routes);



app.get('/logout', (req, res) => {
  req.logout();
  console.log('user logged out');
  res.sendStatus(200);
});

app.post('/register', (req, res) => {
  console.log(req.body);
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      console.log(hash);
      db.User.create({
        username: req.body.username,
        password: hash,
        email: req.body.email
      })
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        return res.send('Stupid username');
      });
    });
  });
});



function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    //not sure exactly what I should do here
    res.redirect('/')
  }
}

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log(`Listening on port: ${PORT}`);
});
