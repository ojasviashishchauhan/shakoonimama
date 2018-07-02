var express= require('express');
var router= express.Router();
var multer = require('multer');
var Detail = require('../models/clothes')
var Review = require('../models/reviews')
var path= require('path');
var lowerCase = require('lower-case');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportConf = require('../config/passport');
mongoose.connect('mongodb://localhost/uploadFiles');



var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback)
  { callback(null, './frontview/photo');},
  filename: function (req, file, callback)
  { callback(null, file.fieldname +'-' + Date.now() +path.extname(file.originalname))
}

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});

router.get('/add_product',passportConf.isAuthenticated,function(req,res){
  //res.render('add_product.html');
  if(req.user.category == "admin"){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
      res.render('error.html');
    }else{
      console.log(data);
      res.render('add_product.html',{data:data,user:req.user});
    }
  });
}else{
  console.log(req.user);
  res.render('error.html',{user:req.user});
}
});

router.post('/add_product', upload.any(), function(req,res){

  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files

  if(!req.body && !req.files){
    res.json({success: false});
  } else {
    var c;
    Detail.findOne({},function(err,data){
      console.log("into detail");

      if (data) {
        console.log("if");
        c = data.unique_id + 1;
      }else{
        c=1;
      }

      var detail = new Detail({

        unique_id:c,
        ItemCode: req.body.itemcode,
        Name: req.body.itemname,
        Group: lowerCase(req.body.itemgroup),
        SellingPrice: req.body.sellingp,
        Quantity : req.body.quantity,
        Squantity: req.body.squantity,
        Mquantity: req.body.mquantity,
        Lquantity: req.body.lquantity,
        XLquantity: req.body.xlquantity,
        Description: req.body.description,
        Stock : req.body.instock,
        image1:req.files[0].filename,
        image2:req.files[1].filename,
        image3:req.files[2].filename,
        image4: req.files[3].filename,
      });

      detail.save(function(err, Person){
        if(err){
          console.log(err);
          res.render('error.html');
        }else{
        var review = new Review();

        review.productid = Person._id;
        // save cart to mongo
        console.log(review.productid);
        review.save(function(err) {
          // oops error might occur
            if (err) throw(err);
            console.log('review databse made for the product');
        });
      }

      Detail.find({}, function(err,data){
        if(err){
          console.log(err);
          res.render('error.html');
        }else{
          console.log(data);
          res.render('add_product.html',{data:data,user:req.user});
        }
      });

      });

    }).sort({_id: -1}).limit(1);

  }
});


router.post('/delete',function(req,res){

   Detail.findByIdAndRemove(req.body.prodId,function(err, data) {
     if(err){
       res.render('error.html');
     }
    console.log(data);

  });
  res.redirect('/add_product');
});

module.exports = router;
