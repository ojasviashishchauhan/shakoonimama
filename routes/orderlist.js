var express= require('express');
var router= express.Router();
var Success = require('../models/successOrder')
let google = require('googleapis');


router.post('/purchase',function(req,res){
  console.log(req.body.query);
  var success = new Success();
  success.Name = req.body.name;
  success.Email = 'req.user.email';
  success.Pincode = req.body.pin;
  success.City  = req.body.city;
  success.State = req.body.state;
  success.Address = req.body.address;
  success.Address1 = req.body.address1;
  success.Phone = req.body.phone;
  success.Amount = req.body.query;
  success.Payment = "Online";
  success.save(function(err){
    if(err) return next(err);

    });

  //});
  //console.log(success);






});


module.exports = router;
