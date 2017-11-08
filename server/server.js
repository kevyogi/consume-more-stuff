const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('../models');
const routes = require('./routes');
const redis = require('connect-redis')(session);
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const saltRounds = 12;
const app = express();

const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 res.setHeader('Access-Control-Allow-Credentials', true);
 next();
});

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  store: new redis(),
  secret: 'aTeam',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

passport.serializeUser((user, done) => {
  console.log('USER', user);
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log(user);
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
  db.User.findOne({where: {username: username}})
    .then((user) => {
      if(user === null){
        return done(null, false, {message: 'bad username or password'});
      }else{
        bcrypt.compare(password, user.password)
        .then((res) => {
          console.log(res);
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
  const user = req.user.data;
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout();
  console.log('user logged out');
  res.sendStatus(200);
});

app.post('/register', (req, res) => {
  console.log(req.body);
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
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

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    //not sure exactly what I should do here
    res.redirect('/')
  }
}

app.listen(PORT, () => {
  db.sequelize.sync({ force:false});
  console.log(`Listening on port: ${PORT}`);
});