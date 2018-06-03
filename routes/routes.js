var express= require('express');
var router= express.Router();
var crypto = require('crypto');
var session = require('express-session');
var User = require('../models/user');
var Cart = require('../models/cart');
var Review = require('../models/reviews');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportConf = require('../config/passport');
var flash = require('connect-flash');
var multer = require('multer');
var Detail = require('../models/clothes')
var path= require('path');
var lowerCase = require('lower-case');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/uploadFiles');

router.get('/error',function(req, res){
  res.render('error.html',{user:req.user});
});
router.get('/profile',function(req, res){
  res.render('profile.html',{user:req.user});
});
router.get('/contact_us',function(req, res){
  res.render('contact_us.html',{user:req.user});
});
router.get('/aboutus',function(req, res){
  res.render('aboutus.html',{user:req.user});
});


router.get('/',function(req,res,next){
  res.set({
    'Access-Control-Allow-Origin' : '*'
  });

  console.log(req.user);
  if(req.user){
    console.log(req.user.firstname);
  }

  return res.render('front.html',{user:req.user});


});

router.post('/rating',passportConf.isAuthenticated,function(req,res,next){
  console.log('rating it...');
  var uname=req.user.firstname;
  var comm='';
  if(req.body.comment){
    comm=req.body.comment;
  }
  console.log(req.body.prid);
  console.log(req.body.code);
  Review.findOne({productid: req.body.prid}, function (err, reviews) {
    if(err){
      console.log(err);
    }
		reviews.rated.push({
			name: uname,
      review: req.body.rating,
      comment:comm,
    });
    console.log('saving review');
		reviews.save(function (err) {
			if (err) return next(err);
			return res.redirect('/');
		})

	});


});

router.post('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

router.get('/signup',function(req,res){
  res.render('signup.html',{user:req.user});
});


router.get('/men',function(req,res){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      //console.log('rendring');
      res.render('men.html',{data:data,user:req.user});
    }
});
});

router.get('/women',function(req,res){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      //console.log('rendring');
      res.render('women.html',{data:data,user:req.user});
    }
});
});



/*
router.get('/index', function(req, res){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
      res.render('index.html',{data:data});
    }
  })

});
*/

router.post('/view',function(req,res,next){
  console.log(req.body.prodId);
  Detail.findById(req.body.prodId, function(err,data){
    if(err){
      console.log(err);
    }else{
      console.log(data);


      Review
    		.findOne({productid: data._id})
    		.populate('rated')
    		.exec(function (err, foundRev) {
    			if (err) return next(err);
          console.log('Rating which is found');
          console.log(foundRev);
          res.render('view.html',{data:data, user:req.user, rev:foundRev});


    });
  }
  });
});




router.get('/cart', passportConf.isAuthenticated, function (req, res, next) {
	Cart
		.findOne({owner: req.user._id})
		.populate('items.item')
		.exec(function (err, foundCart) {
			if (err) return next(err);

			res.render('cart.html', {
				foundCart: foundCart,
				message: req.flash('remove')
			});
		});
});

router.post('/remove', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));

		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);

		foundCart.save(function (err, found) {
			if (err) return next(err);

			req.flash('remove', 'Successfully removed the product');
			res.redirect('/cart');
		});
	});
});

router.post('/checkout', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));

		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    var amount=foundCart.total*100;

			req.flash('remove', 'Successfully removed the product');
			res.render('razorcheckout.html',{data:foundCart,name:req.user,total:amount});

	});
});

//add items to cart
router.post('/addToCart', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, cart) {
		cart.items.push({
			item: req.body.prodId,
			price: parseFloat(req.body.priceValue),
			quantity: parseInt(req.body.quantity)
		});

		cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

		cart.save(function (err) {
			if (err) return next(err);
			return res.redirect('/cart');
		})

	});

});

module.exports = router;
