var express= require('express');
var router= express.Router();
var crypto = require('crypto');
var session = require('express-session');
var User = require('../models/user');
var Cart = require('../models/cart');
var Order = require('../models/orders')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var multer = require('multer');
var Detail = require('../models/clothes')
var mongoose = require('mongoose');
var path= require('path');
var lowerCase = require('lower-case');
var passportConf = require('../config/passport');
var Recaptcha = require('express-recaptcha').Recaptcha;
//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('6LdzoGUUAAAAAG2puBzjmPVDcfOPTix52CK5brun', '6LdzoGUUAAAAACKXJm1W_tgv5yP0azYe9HIABdZh');

mongoose.connect('mongodb://localhost/uploadFiles');


router.post('/login',recaptcha.middleware.verify,function(req,res,next){
   if (!req.recaptcha.error){
     return next();
   }else{
     res.redirect('/error');
   }
}, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/error',
    failureFlash: true
}));

router.post('/logout',function(req,res){

  req.logout();
  res.redirect('/');
});

// Register User
router.post('/signup',recaptcha.middleware.verify, function(req, res){
  if (req.recaptcha.error){
    res.redirect('/error');
  }else{
  if(req.body.password!=req.body.cpassword){
    res.redirect('/error');
  }else{
    User.findOne({ email: req.body.email }, function(err, existingUser) {
               // does the user already exist?
               if (existingUser) {
                   // return an error message to indicate user already exists
                   req.flash('Account with that email address already exists');
                   // redirect the user back to signup page with the error
                   console.log('user exist with same email id');
                   res.render('signup.html',{user:req.user, message:'Account with that email already exists!!'})
               } else {

               	if(!req.body.first_name && !req.body.password && !req.body.email){
               		res.render('signup.html',{user:req.user});
               	} else {
               		var newUser = new User({
               			 firstname: req.body.first_name,
                     lastname: req.body.last_name,
               			 email:req.body.email,
               			 password: req.body.password,
                     phone: req.body.mobile_number,
                     gender: req.body.group1
               		});

                   // save the user to the database if there is no error
                   User.createUser(newUser, function(err, user){
               			if(err) throw err;
               			console.log(user);
                    var cart = new Cart();
                    // set cart owner as the current user
                    cart.owner = user._id;
                    // save cart to mongo
                    cart.save(function(err) {
                      // oops error might occur
                        if (err) return next(err);
                // log user in
                        req.logIn(user, function(err) {
                  // error occurred
                            if (err) {
                              console.log(err);
                            }else{
                  // sucess, redirect user to their profile page
                            console.log('Cart made for the user');
                          }
                        });
                        var order = new Order();
                        order.owner= user._id;

                        order.save(function(err){
                          if(err) return next(err);
                          console.log('Order table made for the user');
                        });
                    });

               		});
               }
               req.flash('success_msg', 'You are registered and can now login');
               console.log('user created');
           		res.redirect('/');

             }
           });

}
}
});



module.exports = router;
