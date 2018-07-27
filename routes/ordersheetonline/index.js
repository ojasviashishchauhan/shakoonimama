const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var express= require('express');
var router= express.Router();
var Success = require('../../models/successOrder')
var Cart = require('../../models/cart');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportConf = require('../../config/passport');
// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';


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
  success.Payment = "Online";


  Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));
      console.log(foundCart);

	});

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
    
      var values = [
      [
        req.body.name,
        req.body.email,
        req.body.pin,
        req.body.city,
        req.body.state,
        req.body.address,
        req.body.address1,
        req.body.phone,
        req.body.query,

      ],
      // Additional rows ...
    ];
    var body = {
      values: values
    };
    sheets.spreadsheets.values.append({
      spreadsheetId: '1QnNX6j6AKmBk2FlKer8mJcHeaFLjJvxnX6qgDHOHjFE',
      range: 'A2:A9',
      valueInputOption: 'USER_ENTERED',
      resource: body
    },function(err, result) {
      if(err) {
        // Handle error.
        console.log(err);
      } else {
        console.log('%d cells updated!!',result.data.updates.updatedCells);
      }
    });

    }

    });

  //});
  console.log(success);


res.redirect('/');



});




module.exports = router;
