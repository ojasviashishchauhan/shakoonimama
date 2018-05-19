//models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//user schema for our user models
var UserSchema = mongoose.Schema({

    firstname:{
      type: String,
      required:true
  },
    lastname:{
      type: String,
      required:true
  },
    email:{
      type: String,
      required:true,
      unique:true
  },
    password:{
    type: String,
    required:true
  },
    phone:{
    type: Number,
    required:true
  },
    gender:{
      type: String,
      required:true
  },
    category:{
      type: String,
      default:'customer',
    },
  created_on:{
    type:Date,
    default:Date.now
  }
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {email: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
