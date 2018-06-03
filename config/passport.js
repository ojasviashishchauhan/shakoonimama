// needed for local authentication
var passport = require('passport');

// needed for local login
var LocalStrategy = require('passport-local').Strategy;

// needed for facebook authentication
//var FacebookStrategy = require('passport-facebook').Strategy;

//var secret = require('../config/secret');

var User = require('../models/user');

var async = require('async');

var Cart = require('../models/cart');


// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


// give the middleware a name, and create a new anonymous instance of LocalStrategy
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
      console.log('No user');
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
        console.log('password matched');
   			return done(null, user);
   		} else {
        console.log('no match for password');
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

/*
passport.use(new FacebookStrategy(secret.facebook, function(token, refreshToken, profile, done) {

    User.findOne({ facebook: profile.id }, function(err, user) {
        if (err) return next(err);

        if (user) {
            return done(null, user);
        } else {
            async.waterfall([
                function(callback) {
                    var newUser = new User();
                    newUser.email = profile._json.email;
                    newUser.facebook = profile.id;
                    newUser.tokens.push({ kind: 'facebook', token: token });
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

                    newUser.save(function(err) {
                        if (err) return next(err);
                        callback(err, newUser._id);
                    })

                },
                function(newUser) {
                    var cart = new Cart();

                    cart.owner = newUser._id;
                    cart.save(function(err) {
                        if (err) return done(err);
                        return done(err, newUser);

                    });
                }
            ]);

        }
    });
}));
*/
// custom function validate
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');

};
