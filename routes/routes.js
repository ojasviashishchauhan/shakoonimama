var express= require('express');
var router= express.Router();
var crypto = require('crypto');
var session = require('express-session');
var User = require('../models/user');
var Cart = require('../models/cart');
var Review = require('../models/reviews');
var Contact = require('../models/contact_data')
var Success = require('../models/successOrder')
var Order = require('../models/orders')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportConf = require('../config/passport');
var flash = require('connect-flash');
var multer = require('multer');
var Detail = require('../models/clothes')
var path= require('path');
var lowerCase = require('lower-case');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/uploadFiles');

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';

const nodemailer = require('nodemailer');



router.get('/error',function(req, res){
  res.render('error.html',{user:req.user});
});
router.get('/ourpolicies',function(req, res){
  res.render('ourpolicies.html',{user:req.user});
});
router.get('/pricing',function(req, res){
  res.render('pricing.html',{user:req.user});
});
router.get('/profile',function(req, res){
  Order.findOne({owner: req.user._id},function(err,orderd1){

  res.render('profile.html',{user:req.user,orderd:orderd1});
});
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

router.post('/connect',function(req,res,next){
  var contact= new Contact({
    Name:req.body.Name,
    Email:req.body.Email,
    Message:req.body.Message
  });

  contact.save(function(err){

    if(err)throw err;
    //console.log(err);
    res.redirect('/contact_us');
  });
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
      res.render('error.html');
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
  res.render('signup.html',{user:req.user,message:'Please fill in all Details!!'});
});

router.get('/checkout',function(req,res){
  Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));

		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);


  res.render('checkout.html',{user:req.user,data:foundCart,extra:0
  });
});
});

//COD checkout
router.get('/checkoutset',function(req, res){
  Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));

		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);


  res.render('checkoutset.html',{user:req.user,data:foundCart,extra:30});
});
});

router.post('/purchase',function(req,res){
  console.log(req.body.query);
  var success = new Success();
  success.Name = req.body.name;
  success.Email = req.body.email;
  success.Pincode = req.body.pin;
  success.City  = req.body.city;
  success.State = req.body.state;
  success.Address = req.body.address;
  success.Address1 = req.body.address1;
  success.Phone = req.body.phone;
  success.Amount = req.body.query;
  success.Payment = req.body.payme;

  success.save(function(err){
    if(err) return next(err);

    // Load client secrets from a local file.
    fs.readFile(path.join(__dirname, 'client_secret.json'), (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), listMajors);
    });

    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    function getNewToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return callback(err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            console.log('Token stored to', TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }

    function listMajors(auth) {
      const sheets = google.sheets({version: 'v4', auth});
//Cart.findOne({owner: req.user._id}, function (err, foundCart) {

  Cart
    .findOne({owner: req.user._id})
    .populate('items.item')
    .exec(function (err, foundCart) {

var totalo = req.body.totalo;
  var v = [
    req.body.payme,
    totalo,
    req.body.name,
    req.body.email,
    req.body.pin,
    req.body.city,
    req.body.state,
    req.body.address,
    req.body.address1,
    req.body.phone,
    req.body.query,
  // Additional rows ...
];
  console.log(foundCart.items.length);
  var x = foundCart.items.length;
  var y = v.length+1;
  //console.log(foundCart.items.pop());
  var po=foundCart.items._id;
  console.log(Detail.po);
  Order.findOne({owner: req.user._id},function(err,orderd){

  for(var i=0;i<x;i++){
    var it = foundCart.items.pop();
    console.log(it);
    console.log('****************************************************************************\n');
    v[y]='-->'
    y++;
    v[y]= it.item.Name;
    y++;
    v[y]= it.item.Group;
    y++;
    v[y]= it.item.ItemCode;
    y++;
    v[y]= it.item.Description;
    y++;
    v[y]=it.size;
    y++;
    console.log(it.item);
    Detail.findById(it.item._id, function(err,data){
      if(err){
        res.render('error.html');
        console.log(err);
      }else{

        console.log('size deleted by 1');
        data.Quantity-=1;
        if(it.size=='S'){
          data.Squantity-=1;
        }else if(it.size=='M'){
          data.Mquantity-=1;
        }else if(it.size=='L'){
          data.Lquantity-=1;
        }else if(it.size=='XL'){
          data.XLquantity-=1;
        }
      }
      data.save(function(err){
        if (err) return next(err);

      });
      return;
  });
    orderd.items.push({
      name:it.item.Name,
      price: parseFloat(it.item.SellingPrice),
      image:it.item.image4,
      size:it.size,
    });

  }

  console.log(v);
  var values=[v]
var d= v.toString();

    var body = {
      values: values
    };
    console.log('going into the sheets');

    sheets.spreadsheets.values.append({
      spreadsheetId: '1QnNX6j6AKmBk2FlKer8mJcHeaFLjJvxnX6qgDHOHjFE',
      range: 'A1',
      valueInputOption: 'RAW',
      resource: body
    },function(err, result) {
      if(err) {
        // Handle error.
        console.log(err);
      } else {
        console.log('must have update');
        console.log('%d cells updated!!',result.data.updates.updatedCells);
      }
      return;
    });

      foundCart.save(function (err, found) {
        if (err) return next(err);

        console.log('cart done');
        return;
      });
      foundCart.total=0;
      orderd.save(function (err) {
        if (err) return next(err);
        return;
      });

      ///lets email stuff

        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
        auth: {
          user: 'hnh.tees@gmail.com',
          pass: 'hnh_tees@123'
        }
      });

      var mailOptions = {
        from: 'hnh.tees@gmail.com',
        to: 'nimittantia77@gmail.com',
        subject: 'New Order here',
        text: d,
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return;
      });
      return;
  	});
    }
    console.log('success');

    return;
    });

  res.redirect('/');
});


router.get('/termsandconditions',function(req,res){
  res.render('termsandconditions.html',{user:req.user});
});

router.get('/men',function(req,res){
  Detail.find({}, function(err,data){
    if(err){
      res.render('error.html');
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
      res.render('error.html');
      console.log(err);
    }else{
      //console.log('rendring');
      res.render('women.html',{data:data,user:req.user});
    }
});
});


router.post('/view',function(req,res,next){
  console.log(req.body.prodId);
  Detail.findById(req.body.prodId, function(err,data){
    if(err){
      res.render('error.html');
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
      console.log(foundCart.items);
			res.render('cart.html', {
        user:req.user,
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


			req.flash('remove', 'Successfully removed the product');

			res.render('checkout.html',{data:foundCart,user:req.user});

	});
});

//add items to cart
router.post('/addToCart', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, cart) {
		cart.items.push({
			item: req.body.prodId,
			price: parseFloat(req.body.priceValue),
      size:req.body.r1,
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
