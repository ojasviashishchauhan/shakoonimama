var http = require ('http');
var express = require('express');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var app = express();
var path= require('path');
var mongo = require('mongodb');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo_db');
var db = mongoose.connection;
var users = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const helmet = require('helmet');
app.use(helmet());


app.use(session({ cookie: { maxAge: 6000000 },
                  secret: 'woot',
                  resave: true,
                  saveUninitialized: false,
                  store: new MongoStore({
                  mongooseConnection: db
    })
  }));



// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());


//to support url-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//including static files
app.use(express.static(__dirname + '/frontview/css/'));
app.use(express.static(__dirname + '/frontview/images/'));
app.use(express.static(__dirname + '/frontview/css/fonts/'));
app.use(express.static(__dirname + '/frontview/photo/'));


//view engines and convert from html to js
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views', path.join(__dirname + '/frontview/html/'));


//including routes
var routes = require('./routes/routes');
var userRoutes=require('./routes/user');
var adminRoutes=require('./routes/admin');
//var orderlist=require('./routes/ordersheetonline/index');
app.use('/',routes);
app.use('/',userRoutes);
app.use('/',adminRoutes);
//app.use('/',orderlist);


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.login = req.isAuthenticated();
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var server=app.listen(3000,function(){
  console.log('server running on 3000');
});
